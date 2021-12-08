import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { Address, TaskModel } from '../models/task.model';
import { Observable, Subject } from 'rxjs';
import { AuthOdooService } from './auth-odoo.service';
import { Router } from '@angular/router';
import { MessageModel } from '../models/message.model';
import { Comments } from '../interfaces/interfaces';

let jayson = require('../../../node_modules/jayson/lib/client/');

let jaysonServer;

let knownTypes = {
    '/': 'data:image/jpg;base64,',
    i: 'data:image/png;base64,',
};

let init: boolean = false;

let user: UsuarioModel;

let applicationList: TaskModel[];
let hiredList: TaskModel[];
let recordList: TaskModel[];
let promoList: TaskModel[];

let offsetApplication: number = 0;
let offsetHired: number = 0;
let offsetRecord: number = 0;
let offsetPromo: number = 0;

let limit: number = 5;

let taskCesar: TaskModel;
let taskChat: TaskModel;

let initTab: boolean = false;
let initPromo: boolean = false;
let initTabAnonimus: boolean = false;

let temp;

let route: string = '';
let lastRoute: string = '';

let task$ = new Subject<any>();
let notificationError$ = new Subject<any>();

let notifications$ = new Subject<boolean>();
let notificationArray: any = [];
let notificationBoolean: boolean = false;

//let chatStatus = ['no', 'invoiced'];

@Injectable({
    providedIn: 'root',
})
export class TaskOdooService {
    constructor(private _authOdoo: AuthOdooService, private router: Router) {
        //jaysonServer = this._authOdoo.OdooInfoJayson;
    }

    setNewPassword(password: string) {
        jaysonServer.password = password;
        user.password = password;
    }

    // setNewJaysonServer(user:UsuarioModel){
    // 	jaysonServer.password = user.password;
    // 	jaysonServer.username = user.username

    // }

    setRoute(rout: string) {
        route = rout;
    }

    setLastRoute(rout: string) {
        lastRoute = rout;
    }

    getLastRoute() {
        return lastRoute;
    }

    setInit(Init) {
        init = Init;
    }

    getInit() {
        return init;
    }

    setInitPromo(init) {
        initPromo = init;
    }

    getInitPromo() {
        return initPromo;
    }

    setInitTab(temp: boolean) {
        initTab = temp;
    }

    getInitTab() {
        return initTab;
    }

    setInitTabAnonimus(temp: boolean) {
        initTabAnonimus = temp;
    }

    getInitTabAnonimus() {
        return initTabAnonimus;
    }

    setUser(usuario: UsuarioModel) {
        offsetApplication = 0;
        offsetHired = 0;
        offsetRecord = 0;
        user = usuario;
        jaysonServer = this._authOdoo.OdooInfoJayson;
        applicationList = [];
        hiredList = [];
        recordList = [];
    }

    setUserAnonimus(usuario: UsuarioModel, Jayson) {
        //console.log(Jayson,"el q llega");

        offsetApplication = 0;
        offsetHired = 0;
        offsetRecord = 0;
        user = usuario;
        jaysonServer = Jayson;
        applicationList = [];
        hiredList = [];
        recordList = [];
        limit = 6;

        //console.log(jaysonServer,"el q se mantiene")
    }

    setTaskCesar(task: TaskModel) {
        taskCesar = task;
    }
    getTaskCesar() {
        return taskCesar;
    }

    setTaskChat(task: TaskModel) {
        taskChat = task;
    }
    getTaskChat() {
        return taskChat;
    }

    getApplicationList() {
        return applicationList;
    }

    getHiredList() {
        return hiredList;
    }

    getRecordList() {
        return recordList;
    }

    getPromoList() {
        return promoList;
    }

    getRequestedTask$(): Observable<any> {
        return task$.asObservable();
    }

    getNotificationError$(): Observable<any> {
        return notificationError$.asObservable();
    }

    getNotificationNav$(): Observable<boolean> {
        return notifications$.asObservable();
    }

    setNotification(notiTemp: boolean) {
        notificationBoolean = notiTemp;
    }

    getNotification() {
        return notificationBoolean;
    }

    getNoificationArray() {
        return notificationArray;
    }

    setNotificationArray(notiTemp: any) {
        notificationArray.push(notiTemp);
    }

    notificationPull() {
        //let id_po = [];
        let id_po_offert = [];
        let id_messg = [];
        let new_offert = [];
        //let id_offert_acepted = [];
        let new_order_line = [];

        let old_id_notification = 0;

        let poll = (uid, partner_id, last) => {
            let path = '/longpolling/poll';

            client = jayson.https({
                host: jaysonServer.host,
                port: jaysonServer.port + path,
            });

            client.request(
                'call',
                {
                    context: { uid: uid },
                    channels: [jaysonServer.db + '_' + partner_id.toString()],
                    last: last,
                },
                { context: { lang: 'es_ES', uid: uid } },
                (err, error, value) => {
                    if (err) {
                        //console.log(err, 'Error poll')
                        poll(user.id, user.partner_id, old_id_notification);
                    } else {
                        // console.log(value, "lo q esta llegando");

                        if (typeof value !== 'undefined' && value.length > 0) {
                            console.log(value, 'lo q esta llegando notificacion');

                            old_id_notification = value[value.length - 1].id;

                            id_po_offert = [];
                            id_messg = [];
                            new_offert = [];
                            //id_offert_acepted = [];
                            new_order_line = [];

                            for (let task of value) {
                                if (
                                    (task['message']['type'] === 'purchase_order_notification' &&
                                        task['message']['action'] === 'canceled') ||
                                    task['message']['action'] === 'calceled'
                                ) {
                                    id_po_offert.push({
                                        order_id: task['message']['order_id'],
                                        origin: task['message']['origin'],
                                    });
                                }

                                if (
                                    task['message']['type'] === 'purchase_order_notification' &&
                                    task['message']['action'] === 'accepted'
                                ) {
                                    new_offert.push({
                                        order_id: task['message']['order_id'],
                                        origin: task['message']['origin'],
                                    });
                                }

                                if (
                                    task['message']['type'] ===
                                        'purchase_order_line_notification' &&
                                    task['message']['action'] === 'new'
                                ) {
                                    new_order_line.push({
                                        order_id: task['message']['order_id'],
                                        origin: task['message']['origin'],
                                        price_unit: task['message']['price_unit'],
                                        product_id: task['message']['product_id'],
                                    });
                                }

                                if (
                                    task['message']['type'] === 'message_notification' &&
                                    task['message']['action'] === 'new'
                                ) {
                                    id_messg.push({
                                        message: task['message']['message_id'],
                                        SO_id: task['message']['sale_id'],
                                        PO_id: task['message']['puchase_id'],
                                        state: task['message']['state'],
                                    });
                                }
                            }

                            if (
                                typeof new_order_line !== 'undefined' &&
                                new_order_line.length > 0
                            ) {
                                console.log('trabajador cambio presupuesto');

                                if (
                                    typeof applicationList !== 'undefined' &&
                                    applicationList.length > 0
                                ) {
                                    for (let line of new_order_line) {
                                        temp = applicationList.findIndex(
                                            (element) => element.So_origin === line.origin
                                        );

                                        if (temp != -1) {
                                            let temp1 = applicationList[temp].So_offers.findIndex(
                                                (element) => element.Po_id === line.order_id
                                            );

                                            if (temp1 != -1) {
                                                switch (line.product_id) {
                                                    case 40:
                                                        applicationList[temp].So_offers[
                                                            temp1
                                                        ].work_force += line.price_unit;
                                                        break;

                                                    case 41:
                                                        applicationList[temp].So_offers[
                                                            temp1
                                                        ].materials += line.price_unit;
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                    // if (route === '/ofertas' || route === '/chat') {
                                    //   task$.next({ type: 13, task: new_order_line })
                                    // }
                                }
                            }

                            if (typeof id_po_offert !== 'undefined' && id_po_offert.length > 0) {
                                console.log('trabajador elimino su oferta');
                                if (
                                    typeof applicationList !== 'undefined' &&
                                    applicationList.length > 0
                                ) {
                                    for (let offer of id_po_offert) {
                                        temp = applicationList.findIndex(
                                            (element) => element.So_origin === offer.origin
                                        );

                                        if (temp != -1) {
                                            let temp1 = applicationList[temp].So_offers.findIndex(
                                                (element) => element.Po_id === offer.order_id
                                            );

                                            if (temp1 != -1) {
                                                applicationList[temp].So_offers.splice(temp1, 1);
                                            }
                                            ////console.log(applicationList);
                                        }
                                    }
                                }

                                if (route === '/ofertas') {
                                    ////console.log("mandando la notificacion", id_po)

                                    task$.next({ type: 4, task: id_po_offert });
                                }
                            }

                            if (typeof new_offert !== 'undefined' && new_offert.length > 0) {
                                console.log('trabajador hizo su oferta ');

                                if (
                                    typeof applicationList !== 'undefined' &&
                                    applicationList.length > 0
                                ) {
                                    if (route === '/ofertas') {
                                        task$.next({ type: 9, task: new_offert });
                                        notifications$.next(true);
                                        notificationBoolean = true;
                                        notificationArray.unshift({
                                            type: 2,
                                            task: new_offert,
                                            upload: 0,
                                        });
                                    } else {
                                        //console.log("poniendo notificacion new offert")
                                        for (let offer of new_offert) {
                                            temp = applicationList.findIndex(
                                                (element) => element.So_origin === offer.origin
                                            );

                                            if (temp != -1) {
                                                applicationList[temp].notificationNewOffert = true;
                                                applicationList[temp].Up_coming_Offer.push(
                                                    offer.order_id
                                                );

                                                task$.next({ type: 9 });
                                                ////console.log(applicationList);
                                            } else {
                                                notificationArray.unshift({
                                                    type: 2,
                                                    task: offer,
                                                    upload: 1,
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    notificationArray.unshift({
                                        type: 2,
                                        task: new_offert,
                                        upload: 1,
                                    });
                                }
                            }

                            if (typeof id_messg !== 'undefined' && id_messg.length > 0) {
                                console.log('trabajador envio mensaje');

                                if (route === '/chat' || route === '/contratados') {
                                    task$.next({ type: 12, task: id_messg });
                                } else {
                                    for (let mess of id_messg) {
                                        if (mess.state != 'purchase') {
                                            if (
                                                typeof applicationList !== 'undefined' &&
                                                applicationList.length > 0
                                            ) {
                                                console.log('mensaje nuevo application list', mess);

                                                temp = applicationList.findIndex(
                                                    (element) => element.So_id === mess.SO_id
                                                );

                                                if (temp != -1) {
                                                    applicationList[temp].notificationNewChat =
                                                        true;
                                                    applicationList[temp].Up_coming_Chat.push({
                                                        Po_id: mess.PO_id,
                                                        messageID: mess.message,
                                                    });
                                                } else {
                                                    notificationArray.unshift({
                                                        type: 3,
                                                        task: mess,
                                                        upload: 1,
                                                        hired: false,
                                                    });
                                                }
                                            }

                                            task$.next({ type: 12, task: id_messg });
                                            notifications$.next(true);
                                            notificationBoolean = true;
                                            notificationArray.unshift({
                                                type: 3,
                                                task: id_messg,
                                                upload: 0,
                                                hired: false,
                                            });
                                        } else {
                                            if (
                                                typeof hiredList !== 'undefined' &&
                                                hiredList.length > 0
                                            ) {
                                                temp = hiredList.findIndex(
                                                    (element) => element.Po_id === mess.PO_id
                                                );

                                                if (temp != -1) {
                                                    hiredList[temp].notificationNewChat = true;
                                                    hiredList[temp].Up_coming_Chat.push({
                                                        Po_id: mess.PO_id,
                                                        messageID: mess.message,
                                                    });
                                                } else {
                                                    notificationArray.unshift({
                                                        type: 3,
                                                        task: mess,
                                                        upload: 1,
                                                        hired: true,
                                                    });
                                                }
                                            }

                                            task$.next({ type: 12, task: id_messg });
                                            notifications$.next(true);
                                            notificationBoolean = true;
                                            notificationArray.unshift({
                                                type: 3,
                                                task: id_messg,
                                                upload: 0,
                                                hired: true,
                                            });
                                        }
                                    }
                                }
                            }

                            poll(user.id, user.partner_id, old_id_notification);
                        } else {
                            poll(user.id, user.partner_id, old_id_notification);
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    //console.log(err, 'Error Notification POsuplier')
                    poll(user.id, user.partner_id, old_id_notification);

                    ///!poner error para reniciar aplicacion;
                } else {
                    poll(user.id, user.partner_id, old_id_notification);
                }
            }
        );
    }

    newTask(task: TaskModel) {
        let count: number;

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', '=', task.So_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error get_so_type');
                        notificationError$.next({ type: 8 });
                    } else {
                        task.type = value[0].product_id[1];

                        if (typeof applicationList !== 'undefined' && applicationList.length > 0) {
                            applicationList.unshift(task);
                        } else {
                            applicationList.push(task);
                        }

                        task$.next({ type: 7 });
                    }
                }
            );
        };

        let obtainSo_origin = function (SO_id: number) {
            let inParams = [];
            inParams.push([['id', '=', SO_id]]);
            inParams.push(['name']);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error obtainSo_origin');
                        notificationError$.next({ type: 8 });
                    } else {
                        task.So_origin = value[0]['name'];
                        task.notificationNewSo = true;
                        task.photoSO = task.photoSO.filter(Boolean);
                        task.downloadPhotoSo = true;
                        get_so_type();
                        //notificationNewSoClient$.next(true);
                    }
                }
            );
        };

        let confirmService = function (SO_id: number) {
            let inParams = [];
            inParams.push(SO_id);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('action_confirm'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error Confirmar Servicio Creado');
                        //notificationError$.next(true);
                        notificationError$.next({ type: 8 });
                    } else {
                        task.So_id = SO_id;
                        task.notificationNewSo = true;

                        task.date_planned = Date.now().toString();
                        task.time = Date.now().toString();

                        if (typeof task.photoSO !== 'undefined' && task.photoSO.length > 0) {
                            for (let i = 0; i < task.photoSO.length; i++) {
                                if (task.photoSO[i]) {
                                    if (knownTypes[task.photoSO[i][0]]) {
                                        task.photoSO[i] =
                                            knownTypes[task.photoSO[i][0]] + task.photoSO[i];
                                    }
                                }
                            }
                        }
                        obtainSo_origin(SO_id);
                    }
                }
            );
        };

        let create_SO_attachment = function (SO_id: number) {
            let attachement = {
                name: 'photoSolicitud_' + count + '.jpg',
                datas: task.photoSO[count],
                type: 'binary',
                description: 'photoSolicitud_' + count.toString + '.jpg',
                res_model: 'sale.order',
                res_id: SO_id,
            };
            let inParams = [];
            inParams.push(attachement);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment'); //model
            fparams.push('create'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error create_SO_attachment');
                        //cancelSOclientSelected(SO_id);
                        notificationError$.next({ type: 8 });
                    } else {
                        count--;
                        if (count >= 0) {
                            create_SO_attachment(SO_id);
                        } else {
                            confirmService(SO_id);
                        }
                    }
                }
            );
        };

        let createService = function () {
            count = 0;

            let SO = {
                company_id: 1,
                order_line: [
                    [
                        0,
                        0,
                        {
                            name: task.type,
                            price_unit: 0.0,
                            product_id: task.product_id,
                            product_uom: 1,
                            product_uom_qty: 1.0,
                            state: 'draft',
                        },
                    ],
                ],
                note: task.description,
                partner_id: task.client_id,
                title: task.title,
                //commitment_date: task.date_planned + ' ' + task.time,
                require_materials: task.require_materials,
                require_payment: false,
                require_signature: false,
                state: 'draft',
                // anonimus: task.anonimus,
                // anonimus_author: task.anonimus_author,
                address_street: task.address.street,
                address_floor: task.address.floor,
                address_portal: task.address.portal,
                address_number: task.address.number,
                address_door: task.address.door,
                address_stairs: task.address.stair,
                address_zip_code: task.address.cp,
                address_latitude: task.address.latitude,
                address_longitude: task.address.longitude,
            };
            let inParams = [];
            inParams.push(SO);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('create'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, ' Error createService');
                        notificationError$.next({ type: 8 });
                    } else {
                        //console.log(value, 'createService')

                        if (task.photoSO.length) {
                            count = task.photoSO.length - 1;
                            create_SO_attachment(value);
                        } else {
                            confirmService(value);
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    //notificationError$.next(true);
                    console.log(err, 'connect');
                    notificationError$.next({ type: 0 });
                } else {
                    createService();
                }
            }
        );
    }

    requestMoreRecordTask() {
        let SO_origin = [];
        let PO_id = [];
        let SO_id = [];
        //let contratados_id = [];
        let recordListTemp: TaskModel[] = [];

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let task of recordListTemp) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);
                            task.type = temp.product_id[1];
                        }

                        recordList = [].concat(recordList, recordListTemp);
                        // console.log(applicationList, 'nuevas en el servicio');
                        task$.next({ type: 20, task: recordListTemp });
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);
            inParams.push(['partner_id', 'origin', 'order_line', 'state', 'name', 'new_budget']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 2 });
                    } else {
                        ////console.log(value, "Po")

                        value = value.filter((po) => {
                            return po.state === 'sent';
                        });

                        for (let task of recordListTemp) {
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                //console.log("se encontro el record",temp['amount_total'])
                                task.So_budget = temp['amount_total'];
                            }
                        }

                        get_so_type();
                    }
                }
            );
        };

        let get_so_list = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'invoiced'],
                ['finish', '=', true],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'id',
                'title',
                'commitment_date',
                'finish',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetRecord, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        offsetRecord += limit;

                        for (let order of value) {
                            let temp = new TaskModel();
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            //SO_origin_hired.push(order['name'])
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['commitment_date']);
                            temp.finish = order['finish'];
                            recordListTemp.push(temp);
                        }
                        if (typeof recordListTemp !== 'undefined' && recordListTemp.length) {
                            get_po_of_task();
                        } else {
                            //!Actualizar observable
                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list();
                }
            }
        );
    }

    requestMoreHiredTask() {
        //console.log('buscando mas tareas hired');

        let SO_origin = [];
        let PO_id = [];
        let hiredListTemp: TaskModel[] = [];
        let SO_origin_hired = [];
        let invoice_line_ids_temp = [];

        let get_order_line = () => {
            //console.log(PO_id, 'extra');

            let inParams = [];
            inParams.push([['order_id', 'in', PO_id]]);
            // inParams.push([['order_id', '=', 2146]]);
            inParams.push(['product_id', 'product_qty', 'price_unit', 'qty_invoiced']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        // console.log(value, 'order Line');

                        for (let orderLine of value) {
                            // console.log('for hired list');
                            for (let task of hiredListTemp) {
                                for (let line of task.Po_order_line) {
                                    // console.log(line, 'lineas');
                                    if (line === orderLine.id) {
                                        //console.log('encontrada');

                                        switch (orderLine.product_id[0]) {
                                            // case 39:

                                            // 	task.type = "Servicio de Fontanería"
                                            // 	break;

                                            case 40:
                                                // console.log('hay materiales extra');
                                                if (
                                                    orderLine.product_qty != orderLine.qty_invoiced
                                                ) {
                                                    task.work_force_extra += orderLine.price_unit;
                                                }
                                                break;

                                            case 41:
                                                console.log('mano de obra extra');
                                                if (
                                                    orderLine.product_qty != orderLine.qty_invoiced
                                                ) {
                                                    task.materials_extra += orderLine.price_unit;
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        hiredList = [].concat(hiredList, hiredListTemp);
                        //console.log(hiredListTemp, 'mas contratados');
                        task$.next({ type: 14, task: hiredListTemp });
                    }
                }
            );
        };

        let get_facturation_lines_information = () => {
            let inParams = [];
            inParams.push([['id', 'in', invoice_line_ids_temp]]);
            inParams.push(['product_id', 'price_unit']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let orderLine of value) {
                            for (let task of hiredListTemp) {
                                for (let line of task.facturation_line) {
                                    let temp = line.findIndex(
                                        (element) => element === orderLine.id
                                    );

                                    if (temp != -1) {
                                        switch (orderLine.product_id[0]) {
                                            case 39:
                                                task.type = 'Servicio de Fontanería';
                                                break;

                                            case 40:
                                                task.work_force = orderLine.price_unit;
                                                break;

                                            case 41:
                                                task.materials = orderLine.price_unit;
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        get_order_line();
                    }
                }
            );
        };

        let get_facturation_lines = () => {
            let inParams = [];
            inParams.push([['invoice_origin', 'in', SO_origin_hired]]);
            inParams.push(['invoice_line_ids', 'invoice_origin', 'has_complaint']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        ////console.log(value, 'get_facturation_lines')

                        for (let task of hiredListTemp) {
                            for (let line of value) {
                                if (line.invoice_origin === task.So_origin) {
                                    task.facturation_line.push(line.invoice_line_ids);
                                    task.facturation_id = line.id;

                                    if (line.has_complaint) {
                                        task.legal_status = true;
                                        task.legal_status_solved = 1;
                                    }

                                    for (let line1 of line.invoice_line_ids) {
                                        invoice_line_ids_temp.push(line1);
                                    }
                                }
                            }
                        }

                        get_facturation_lines_information();
                    }
                }
            );
        };

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([PO_id]);
            inParams.push([
                ['res_id', 'in', PO_id],
                ['message_type', '!=', 'ranking'],
            ]);
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error list_msg_ids");
                        notificationError$.next({ type: 2 });
                    } else {
                        //////console.log(value, "messages")
                        value = value.filter((messages) => {
                            return messages.subtype_id[1] === 'Discussions';
                        });
                        value.reverse();

                        for (let task of hiredListTemp) {
                            //////console.log(task, "lista de contratados");
                            //////console.log(value, "lista de messaje");
                            for (let message of value) {
                                //////console.log(message, "lista de messaje");
                                let temp = value.find((element) => element.res_id === task.Po_id);
                                if (temp) {
                                    //////console.log("mensaje para contrato");
                                    let tempMessage: MessageModel = new MessageModel(
                                        message['body'].slice(3, message['body'].length - 4),
                                        message['author_id'][1],
                                        message['author_id'][0],
                                        message['res_id']
                                    );
                                    task.messageList.push(tempMessage);
                                }
                            }
                        }

                        // ////console.log(applicationList);
                        // ////console.log(hiredList)

                        get_facturation_lines();

                        //!!Obtener Facturas
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);
            inParams.push(['partner_id', 'origin', 'order_line', 'state', 'name', 'extra_budget']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        notificationError$.next({ type: 2 });
                        ////console.log(err, 'Error requestOffersForTask');
                    } else {
                        //////console.log(value, "Po")

                        for (let task of hiredListTemp) {
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                //provider_partner_id.push(temp['partner_id'][0]);
                                task.provider_id = temp['partner_id'][0];
                                task.provider_name = temp['partner_id'][1];
                                task.Po_state = temp['state'];
                                task.Po_id = temp['id'];
                                task.notificationExtraCost = temp['extra_budget'];
                                PO_id.push(temp['id']);
                                //task.budget = temp['amount_total'];
                                //task.origin = temp['origin'];
                            }
                        }

                        //get_order_line();

                        // ////console.log(hiredList, "contratadas");
                        // ////console.log(applicationList, "solicitadas");
                        //search_avatar_provider();

                        //hiredList = [].concat(hiredList, hiredListTemp);
                        list_msg_ids();
                    }
                }
            );
        };

        let get_so_list_hired = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'invoiced'],
                ['finish', '=', false],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                'require_materials',
                'commitment_date',
                'address_street',
                'address_floor',
                'address_portal',
                'address_number',
                'address_door',
                'address_stairs',
                'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                'finish',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetHired, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        offsetHired += limit;

                        for (let order of value) {
                            let temp = new TaskModel();
                            //SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            SO_origin_hired.push(order['name']);
                            temp.description = order['note'];
                            temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.require_materials = order['require_materials'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['commitment_date']);
                            temp.notificationNewChat = order['new_chat'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            temp.finish = order['finish'];
                            hiredListTemp.push(temp);
                        }

                        //////console.log(hiredList, "task Hired");
                        //get_po_of_task();
                        if (typeof hiredListTemp !== 'undefined' && hiredListTemp.length > 0) {
                            get_po_of_task();
                        } else {
                            //!Actualizar observable
                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list_hired();
                }
            }
        );
    }

    requestMoreApplicationTask() {
        let SO_origin = [];
        let PO_id = [];
        let SO_id = [];
        //let contratados_id = [];
        let applicationListTemp: TaskModel[] = [];

        let newTaskModel = new TaskModel();

        let get_order_line = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', PO_id]]);
            inParams.push(['product_id', 'product_qty', 'price_unit']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let orderLine of value) {
                            for (let task of applicationListTemp) {
                                for (let offer of task.So_offers) {
                                    for (let line of offer.Po_order_line) {
                                        //////console.log(line, "lineas");
                                        if (line === orderLine.id) {
                                            switch (orderLine.product_id[0]) {
                                                case 40:
                                                    offer.work_force += orderLine.price_unit;
                                                    break;

                                                case 41:
                                                    offer.materials += orderLine.price_unit;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        applicationList = [].concat(applicationList, applicationListTemp);
                        // console.log(applicationList, 'nuevas en el servicio');
                        task$.next({ type: 2, task: applicationListTemp });
                        //!!Actualizar observable
                        //get_photo_so();
                    }
                }
            );
        };

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([PO_id]);
            inParams.push([
                ['res_id', 'in', PO_id],
                ['message_type', '!=', 'ranking'],
            ]);
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error list_msg_ids");
                        notificationError$.next({ type: 2 });
                    } else {
                        //////console.log(value, "messages")
                        value = value.filter((messages) => {
                            return (
                                messages.subtype_id === false ||
                                messages.subtype_id[1] === 'Discussions'
                            );
                        });
                        value.reverse();

                        for (let task of applicationListTemp) {
                            for (let offer of task.So_offers) {
                                for (let message of value) {
                                    if (message.res_id === offer.Po_id) {
                                        let tempMessage: MessageModel = new MessageModel(
                                            message['body'].slice(3, message['body'].length - 4),
                                            message['author_id'][1],
                                            message['author_id'][0],
                                            message['res_id']
                                        );
                                        offer.messageList.push(tempMessage);
                                    }
                                }
                            }
                        }
                        // ////console.log(applicationList);
                        // ////console.log(hiredList)

                        get_order_line();
                    }
                }
            );
        };

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let task of applicationListTemp) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);
                            task.type = temp.product_id[1];
                        }
                        list_msg_ids();
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);
            inParams.push(['partner_id', 'origin', 'order_line', 'state', 'name', 'new_budget']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 2 });
                    } else {
                        ////console.log(value, "Po")

                        value = value.filter((po) => {
                            return po.state === 'sent';
                        });

                        for (let task of applicationListTemp) {
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                newTaskModel = new TaskModel();
                                task.notificationNewOffert = temp['new_budget'];
                                //provider_partner_id.push(temp['partner_id'][0]);
                                newTaskModel.provider_id = temp['partner_id'][0];
                                newTaskModel.provider_name = temp['partner_id'][1];
                                newTaskModel.notificationNewOffert = temp['new_budget'];
                                newTaskModel.Po_id = temp['id'];
                                newTaskModel.So_id = task.So_id;
                                PO_id.push(temp['id']);
                                newTaskModel.Po_order_line = temp['order_line'];
                                //task.budget = temp['amount_total'];
                                task.So_offers.push(newTaskModel);
                            }
                        }

                        get_so_type();

                        //list_msg_ids();

                        //get_order_line();

                        // ////console.log(hiredList, "contratadas");
                        // ////console.log(applicationList, "solicitadas");
                        //search_avatar_provider();
                    }
                }
            );
        };

        let get_so_list = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'to invoice'],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                'require_materials',
                'commitment_date',
                'address_street',
                'address_floor',
                'address_portal',
                'address_number',
                'address_door',
                'address_stairs',
                'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetApplication, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        offsetApplication += limit;

                        for (let order of value) {
                            let temp = new TaskModel();

                            // if (order['invoice_status'] === 'invoiced') {
                            // 	//contratados_id.push(order['name']);
                            // }
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            temp.description = order['note'];
                            //temp.type = order['client_order_ref'];
                            temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.require_materials = order['require_materials'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['commitment_date']);
                            temp.notificationNewChat = order['new_chat'];
                            //temp.notificationNewOffert = order['po_agreement'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            applicationListTemp.push(temp);
                        }
                        if (
                            typeof applicationListTemp !== 'undefined' &&
                            applicationListTemp.length
                        ) {
                            get_po_of_task();
                        } else {
                            //!Actualizar observable
                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list();
                }
            }
        );
    }

    requestTaskListClient() {
        applicationList = [];
        hiredList = [];
        recordList = [];
        let SO_origin = [];
        let SO_origin_hired = [];
        let PO_id = [];
        let SO_id = [];
        //let contratados_id = [];
        //let provider_partner_id = [];
        let newTaskModel = new TaskModel();
        let invoice_line_ids_temp = [];

        let get_order_line = () => {
            //console.log(PO_id, 'extra');

            let inParams = [];
            inParams.push([['order_id', 'in', PO_id]]);
            // inParams.push([['order_id', '=', 2146]]);
            inParams.push(['product_id', 'product_qty', 'price_unit', 'qty_invoiced']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        // console.log(value, 'order Line');

                        for (let orderLine of value) {
                            for (let task of applicationList) {
                                for (let offer of task.So_offers) {
                                    for (let line of offer.Po_order_line) {
                                        //console.log(line, "lineas");
                                        if (line === orderLine.id) {
                                            switch (orderLine.product_id[0]) {
                                                // case 39:

                                                // 	task.type = "Servicio de Fontanería"
                                                // 	break;

                                                case 40:
                                                    offer.work_force += orderLine.price_unit;
                                                    break;

                                                case 41:
                                                    offer.materials += orderLine.price_unit;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        for (let orderLine of value) {
                            // console.log('for hired list');
                            for (let task of hiredList) {
                                for (let line of task.Po_order_line) {
                                    // console.log(line, 'lineas');
                                    if (line === orderLine.id) {
                                        //console.log('encontrada');

                                        switch (orderLine.product_id[0]) {
                                            // case 39:

                                            // 	task.type = "Servicio de Fontanería"
                                            // 	break;

                                            case 40:
                                                // console.log('hay materiales extra');
                                                if (
                                                    orderLine.product_qty != orderLine.qty_invoiced
                                                ) {
                                                    task.work_force_extra += orderLine.price_unit;
                                                }
                                                break;

                                            case 41:
                                                //console.log('mano de obra extra');
                                                if (
                                                    orderLine.product_qty != orderLine.qty_invoiced
                                                ) {
                                                    task.materials_extra += orderLine.price_unit;
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        ////console.log(applicationList, 'con presupuesto');
                        ////console.log(hiredList, 'contratadas');
                        //console.log(recordList, 'historial');
                        task$.next({ type: 1 });
                        //get_photo_so();
                    }
                }
            );
        };

        let get_facturation_lines_information = () => {
            let inParams = [];
            inParams.push([['id', 'in', invoice_line_ids_temp]]);
            inParams.push(['product_id', 'price_unit']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        for (let orderLine of value) {
                            for (let task of hiredList) {
                                for (let line of task.facturation_line) {
                                    let temp = line.findIndex(
                                        (element) => element === orderLine.id
                                    );

                                    if (temp != -1) {
                                        switch (orderLine.product_id[0]) {
                                            case 39:
                                                task.type = 'Servicio de Fontanería';
                                                break;

                                            case 40:
                                                task.work_force = orderLine.price_unit;
                                                break;

                                            case 41:
                                                task.materials = orderLine.price_unit;
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        get_order_line();
                    }
                }
            );
        };

        let get_facturation_lines = () => {
            let inParams = [];
            inParams.push([['invoice_origin', 'in', SO_origin_hired]]);
            inParams.push(['invoice_line_ids', 'invoice_origin', 'has_complaint']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        //console.log(value, 'facturation');
                        for (let task of hiredList) {
                            for (let line of value) {
                                if (line.invoice_origin === task.So_origin) {
                                    task.facturation_line.push(line.invoice_line_ids);
                                    task.facturation_id = line.id;
                                    if (line.has_complaint) {
                                        task.legal_status = true;
                                        task.legal_status_solved = 1;
                                    }
                                    //task.facturation_name = line.name;
                                    for (let line1 of line.invoice_line_ids) {
                                        invoice_line_ids_temp.push(line1);
                                    }
                                }
                            }
                        }

                        get_facturation_lines_information();
                    }
                }
            );
        };

        let list_msg_ids = () => {
            ////console.log(PO_id, "po_id requeridas");

            let inParams = [];
            inParams.push([PO_id]);
            inParams.push([
                ['res_id', 'in', PO_id],
                ['message_type', '!=', 'ranking'],
            ]);
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error list_msg_ids");
                        notificationError$.next({ type: 1 });
                    } else {
                        ////console.log(value, "messages")

                        value = value.filter((messages) => {
                            return (
                                messages.subtype_id === false ||
                                messages.subtype_id[1] === 'Discussions'
                            ); //&& messages.message_type !== "ranking";
                        });
                        value.reverse();

                        for (let task of applicationList) {
                            for (let offer of task.So_offers) {
                                for (let message of value) {
                                    if (message.res_id === offer.Po_id) {
                                        let tempMessage: MessageModel = new MessageModel(
                                            message['body'].slice(3, message['body'].length - 4),
                                            message['author_id'][1],
                                            message['author_id'][0],
                                            message['res_id']
                                        );
                                        offer.messageList.push(tempMessage);
                                    }
                                }
                            }
                        }

                        for (let task of hiredList) {
                            //////console.log(task, "lista de contratados");
                            //////console.log(value, "lista de messaje");
                            for (let message of value) {
                                //////console.log(message, "lista de messaje");
                                if (message.res_id === task.Po_id) {
                                    //////console.log("mensaje para contrato");
                                    let tempMessage: MessageModel = new MessageModel(
                                        message['body'].slice(3, message['body'].length - 4),
                                        message['author_id'][1],
                                        message['author_id'][0],
                                        message['res_id']
                                    );
                                    task.messageList.push(tempMessage);
                                }
                            }
                        }

                        // ////console.log(applicationList);
                        // ////console.log(hiredList)

                        //get_order_line();
                        get_facturation_lines();
                    }
                }
            );
        };

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        for (let task of applicationList) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);

                            if (temp) {
                                task.type = temp.product_id[1];
                            }
                        }

                        for (let task of recordList) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);
                            if (temp) {
                                task.type = temp.product_id[1];
                            }
                        }

                        list_msg_ids();
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);

            inParams.push([
                'partner_id',
                'origin',
                'order_line',
                'state',
                'name',
                'new_budget',
                'cash',
                'amount_total',
                'extra_budget',
            ]);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 1 });
                    } else {
                        value = value.filter((po) => {
                            return po.state === 'sent' || po.state === 'purchase';
                        });

                        ////console.log(value, "valores de PO")

                        for (let task of value) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_origin === task.origin
                            );
                            if (temp != -1) {
                                applicationList[temp].notificationNewOffert = task['new_budget'];
                                newTaskModel = new TaskModel();
                                //provider_partner_id.push(temp['partner_id'][0]);
                                newTaskModel.provider_id = task['partner_id'][0];
                                newTaskModel.provider_name = task['partner_id'][1];
                                newTaskModel.Po_id = task['id'];
                                newTaskModel.So_id = applicationList[temp].So_id;
                                newTaskModel.notificationNewOffert = task['new_budget'];
                                PO_id.push(task['id']);
                                newTaskModel.Po_order_line = task['order_line'];
                                //task.budget = temp['amount_total'];
                                applicationList[temp].So_offers.push(newTaskModel);
                            }
                        }

                        ////console.log(PO_id, "Para buscar presupuestos");

                        for (let task of hiredList) {
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                //provider_partner_id.push(temp['partner_id'][0]);
                                task.provider_id = temp['partner_id'][0];
                                task.provider_name = temp['partner_id'][1];
                                task.Po_state = temp['state'];
                                task.Po_id = temp['id'];
                                task.cash = temp['cash'];
                                task.notificationExtraCost = temp['extra_budget'];
                                PO_id.push(temp['id']);
                                task.Po_order_line = temp['order_line'];

                                //task.budget = temp['amount_total'];
                                //task.origin = temp['origin'];
                            }
                        }

                        for (let task of recordList) {
                            //console.log("entrando a los records");
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                //console.log("se encontro el record",temp['amount_total'])
                                task.So_budget = temp['amount_total'];
                            }
                        }

                        get_so_type();
                    }
                }
            );
        };

        let get_so_list_record = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'invoiced'],
                ['finish', '=', true],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'id',
                'title',
                'commitment_date',
                'finish',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetRecord, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        offsetRecord += limit;

                        ////console.log(value, "So history")

                        for (let order of value) {
                            let temp = new TaskModel();
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            //SO_origin_hired.push(order['name'])
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.finish = order['finish'];
                            recordList.push(temp);
                        }

                        //////console.log(hiredList, "task Hired");
                        //get_po_of_task();
                        if (
                            (typeof hiredList !== 'undefined' && hiredList.length > 0) ||
                            (typeof applicationList !== 'undefined' && applicationList.length) ||
                            (typeof recordList !== 'undefined' && recordList.length)
                        ) {
                            get_po_of_task();

                            //list_msg_ids();
                        } else {
                            task$.next({ type: 0 });
                            //!Actualizar observable
                        }
                    }
                }
            );
        };

        let get_so_list_hired = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'invoiced'],
                ['finish', '=', false],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                'require_materials',
                'commitment_date',
                'address_street',
                'address_floor',
                'address_portal',
                'address_number',
                'address_door',
                'address_stairs',
                'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                'finish',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetHired, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        offsetHired += limit;

                        ////console.log(value, "So contratadas")

                        for (let order of value) {
                            let temp = new TaskModel();
                            //SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            SO_origin_hired.push(order['name']);
                            temp.description = order['note'];
                            temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.require_materials = order['require_materials'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['commitment_date']);
                            temp.notificationNewChat = order['new_chat'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            temp.finish = order['finish'];
                            hiredList.push(temp);
                        }

                        //////console.log(hiredList, "task Hired");
                        //get_po_of_task();
                        get_so_list_record();
                    }
                }
            );
        };

        let get_so_list = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', user.partner_id],
                ['invoice_status', '=', 'to invoice'],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                'require_materials',
                'commitment_date',
                'address_street',
                'address_floor',
                'address_portal',
                'address_number',
                'address_door',
                'address_stairs',
                'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetApplication, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 1 });
                    } else {
                        offsetApplication += limit;
                        ////console.log(value, "task");

                        for (let order of value) {
                            let temp = new TaskModel();

                            // if (order['invoice_status'] === 'invoiced') {
                            // 	//contratados_id.push(order['name']);
                            // }
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            temp.description = order['note'];
                            //temp.type = order['client_order_ref'];
                            temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            temp.require_materials = order['require_materials'];
                            temp.date_created = order['date_order'];
                            temp.date_planned = String(order['commitment_date']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['commitment_date']);
                            temp.notificationNewChat = order['new_chat'];
                            //temp.notificationNewOffert = order['po_agreement'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            applicationList.push(temp);
                        }
                        get_so_list_hired();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list();
                }
            }
        );
    }

    cancelSOclient(SO_id: number) {
        let cancelSOclientSelected = function () {
            let inParams = [];
            inParams.push([SO_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('action_cancel'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        notificationError$.next({ type: 3 });
                        ////console.log(err, 'Error cancelSOclientSelected');
                    } else {
                        let temp = applicationList.findIndex((element) => element.So_id === SO_id);
                        if (temp !== -1) {
                            applicationList.splice(temp, 1);
                        }
                        task$.next({ type: 3, task: SO_id });
                        //notificationSoCancelled$.next(SO_id);
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    ////console.log(err, 'Error cancelSOclient');
                    notificationError$.next({ type: 0 });
                } else {
                    cancelSOclientSelected();
                }
            }
        );
    }

    cancelPOsuplier(Po: TaskModel) {
        let cancelPOsuplierSelected = function () {
            let inParams = [];
            inParams.push([Po.Po_id]);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('button_cancel'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error cancelPOsuplierSelected');
                        notificationError$.next({ type: 4 });
                    } else {
                        // task$.next({
                        // 	type: 4, task: {
                        // 		order_id: Po.Po_id,
                        // 		origin: Po.So_origin
                        // 	}
                        // });
                        //notificationPoCancelled$.next([id]);
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'Error cancelPOsuplier');
                } else {
                    cancelPOsuplierSelected();
                }
            }
        );
    }

    acceptProvider(PO_id: number, SO_id: number, card) {
        let id_stripe;
        let invClient;
        let stripe;
        let paymentToken;

        let pay_client_invoice = () => {
            let inParams = [];
            inParams.push([invClient]);
            inParams.push(paymentToken);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move'); //model
            fparams.push('cliente_stripe_pay_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error pay_client_invoice");
                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log("pago correcto", result);
                        task$.next({ type: 6 });
                    }
                }
            );
        };

        let search_payment_token_fields = () => {
            //!!Coger el ultimo por ahora
            //let partner_id = flow.get('partnerID')
            let inParams = [];
            inParams.push([['partner_id', '=', user.partner_id]]);
            inParams.push([
                'name',
                'short_name',
                'partner_id',
                'acquirer_id',
                'acquirer_ref',
                'stripe_payment_method',
                'active',
                'payment_ids',
                'verified',
                'company_id',
            ]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.token'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error search_payment_token_fields");
                        notificationError$.next({ type: 6 });
                    } else {
                        if (typeof result !== 'undefined' && result.length > 0) {
                            if (result[0].id) {
                                paymentToken = result[0].id;
                                ////console.log(paymentToken, "correcto search_payment_token_fields"),
                                pay_client_invoice();
                            } else {
                                ////console.log(err, "Error search_payment_token_fields");

                                notificationError$.next({ type: 6 });
                            }
                        } else {
                            notificationError$.next({ type: 6 });
                        }
                    }
                }
            );
        };

        let create_payment_token = () => {
            //const id_stripe = flow.get('stripe')
            let inParams = [];
            inParams.push([id_stripe]);
            inParams.push(card);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.acquirer'); //model
            fparams.push('stripe_token_from_payment'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error create_payment_token");

                        notificationError$.next({ type: 6 });
                    } else {
                        console.log('Correcto create_payment_token', result);
                        search_payment_token_fields();
                    }
                }
            );
        };

        let search_payment_acquirer_fields = () => {
            let inParams = [];
            inParams.push([['provider', '=', 'stripe']]);
            // inParams.push([[1, '=', 1]])
            inParams.push([
                'provider',
                'stripe_secret_key',
                'stripe_publishable_key',
                'name',
                'description',
                'state',
                'save_token',
                'capture_manually',
            ]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.acquirer'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error search_payment_acquirer_fields");

                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log(stripe, " Correcto search_payment_acquirer_fields");
                        stripe = result[0].id;
                        create_payment_token();
                    }
                }
            );
        };

        let create_SO_invoice = () => {
            let inParams = [];
            inParams.push([SO_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('create_full_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error create_SO_invoice");

                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log(invClient, "Correcto create_SO_invoice");
                        invClient = value;
                        search_payment_acquirer_fields();
                        //task$.next({ type: 6 })
                    }
                }
            );
        };

        let confirm_PO = () => {
            let inParams = [];
            inParams.push([PO_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('button_confirm'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error confirm_PO');
                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log('confirm_PO correcto');
                        create_SO_invoice();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    ////console.log(err, 'Error conectando');
                    notificationError$.next({ type: 0 });
                } else {
                    confirm_PO();
                    //search_payment_acquirer_fields();
                }
            }
        );
    }

    acceptProviderCash(PO_id: number, SO_id: number, card) {
        let id_stripe;
        let invClient;
        let stripe;
        let paymentToken;

        let pay_client_invoice = () => {
            let inParams = [];
            inParams.push([invClient]);
            inParams.push(paymentToken);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('account.move'); //model
            fparams.push('cliente_stripe_pay_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error pay_client_invoice");
                        notificationError$.next({ type: 6 });
                    } else {
                        task$.next({ type: 6 });

                        ////console.log("pago correcto", result);
                    }
                }
            );
        };

        let search_payment_token_fields = () => {
            //!!Coger el ultimo por ahora
            //let partner_id = flow.get('partnerID')
            let inParams = [];
            inParams.push([['partner_id', '=', user.partner_id]]);
            inParams.push([
                'name',
                'short_name',
                'partner_id',
                'acquirer_id',
                'acquirer_ref',
                'stripe_payment_method',
                'active',
                'payment_ids',
                'verified',
                'company_id',
            ]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.token'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error search_payment_token_fields");
                        notificationError$.next({ type: 6 });
                    } else {
                        if (typeof result !== 'undefined' && result.length > 0) {
                            if (result[0].id) {
                                paymentToken = result[0].id;
                                ////console.log(paymentToken, "correcto search_payment_token_fields"),
                                pay_client_invoice();
                            } else {
                                ////console.log(err, "Error search_payment_token_fields");

                                notificationError$.next({ type: 6 });
                            }
                        } else {
                            notificationError$.next({ type: 6 });
                        }
                    }
                }
            );
        };

        let create_payment_token = () => {
            //const id_stripe = flow.get('stripe')
            let inParams = [];
            inParams.push([id_stripe]);
            inParams.push(card);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.acquirer'); //model
            fparams.push('stripe_token_from_payment'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error create_payment_token");

                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log("Correcto create_payment_token");
                        search_payment_token_fields();
                    }
                }
            );
        };

        let search_payment_acquirer_fields = () => {
            let inParams = [];
            inParams.push([['provider', '=', 'stripe']]);
            // inParams.push([[1, '=', 1]])
            inParams.push([
                'provider',
                'stripe_secret_key',
                'stripe_publishable_key',
                'name',
                'description',
                'state',
                'save_token',
                'capture_manually',
            ]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('payment.acquirer'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        ////console.log(err, "Error search_payment_acquirer_fields");

                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log(stripe, " Correcto search_payment_acquirer_fields");
                        stripe = result[0].id;
                        create_payment_token();
                    }
                }
            );
        };

        let create_SO_invoice = () => {
            let inParams = [];
            inParams.push([SO_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('create_full_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error create_SO_invoice");

                        notificationError$.next({ type: 6 });
                    } else {
                        ////console.log(invClient, "Correcto create_SO_invoice");
                        invClient = value;
                        search_payment_acquirer_fields();
                        //task$.next({ type: 6 })
                    }
                }
            );
        };

        let confirm_PO = () => {
            let inParams = [];
            inParams.push([PO_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('button_confirm'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error confirm_PO');
                        notificationError$.next({ type: 6 });
                    } else {
                        create_SO_invoice();
                        ////console.log('confirm_PO correcto');
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    ////console.log(err, 'Error conectando');
                    notificationError$.next({ type: 0 });
                } else {
                    confirm_PO();
                    //search_payment_acquirer_fields();
                }
            }
        );
    }

    // acceptProviderCash(PO_id: number, SO_id: number) {
    //   let create_SO_invoice = () => {
    //     let inParams = []
    //     inParams.push([SO_id])
    //     let params = []
    //     params.push(inParams)

    //     let fparams = []
    //     fparams.push(jaysonServer.db)
    //     fparams.push(user.id)
    //     fparams.push(jaysonServer.password)
    //     fparams.push('sale.order') //model
    //     fparams.push('create_full_invoice') //method

    //     for (let i = 0; i < params.length; i++) {
    //       fparams.push(params[i])
    //     }

    //     client.request(
    //       'call',
    //       { service: 'object', method: 'execute_kw', args: fparams },
    //       function (err, error, value) {
    //         if (err) {
    //           ////console.log(err, "Error create_SO_invoice");

    //           notificationError$.next({ type: 6 })
    //         } else {
    //           ////console.log(invClient, "Correcto create_SO_invoice");
    //           task$.next({ type: 6 })
    //         }
    //       },
    //     )
    //   }

    //   let set_cash_true = () => {
    //     let inParams = []
    //     inParams.push([PO_id])
    //     inParams.push({ cash: true })
    //     let params = []
    //     params.push(inParams)

    //     let fparams = []
    //     fparams.push(jaysonServer.db)
    //     fparams.push(user.id)
    //     fparams.push(jaysonServer.password)
    //     fparams.push('write') //model
    //     fparams.push('purchase.order') //method

    //     for (let i = 0; i < params.length; i++) {
    //       fparams.push(params[i])
    //     }

    //     client.request(
    //       'call',
    //       { service: 'object', method: 'execute_kw', args: fparams },
    //       function (err, error, value) {
    //         if (err) {
    //           ////console.log(err, "Error create_SO_invoice");

    //           notificationError$.next({ type: 6 })
    //         } else {
    //           ////console.log(invClient, "Correcto create_SO_invoice");
    //           create_SO_invoice()
    //         }
    //       },
    //     )
    //   }

    //   let confirm_PO = () => {
    //     let inParams = []
    //     inParams.push([PO_id])
    //     let params = []
    //     params.push(inParams)

    //     let fparams = []
    //     fparams.push(jaysonServer.db)
    //     fparams.push(user.id)
    //     fparams.push(jaysonServer.password)
    //     fparams.push('purchase.order') //model
    //     fparams.push('button_confirm') //method

    //     for (let i = 0; i < params.length; i++) {
    //       fparams.push(params[i])
    //     }

    //     client.request(
    //       'call',
    //       { service: 'object', method: 'execute_kw', args: fparams },
    //       function (err, error, value) {
    //         if (err) {
    //           ////console.log(err, 'Error confirm_PO');
    //           notificationError$.next({ type: 6 })
    //         } else {
    //           ////console.log('confirm_PO correcto');
    //           set_cash_true()
    //         }
    //       },
    //     )
    //   }

    //   let client = jayson.https({
    //     host: jaysonServer.host,
    //     port: jaysonServer.port + jaysonServer.pathConnection,
    //   })
    //   client.request(
    //     'call',
    //     {
    //       service: 'common',
    //       method: 'login',
    //       args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
    //     },
    //     (err, error, value) => {
    //       if (err || !value) {
    //         ////console.log(err, 'Error conectando');
    //         notificationError$.next({ type: 0 })
    //       } else {
    //         confirm_PO()
    //         //search_payment_acquirer_fields();
    //       }
    //     },
    //   )
    // }

    payProvider(Po_id) {
        let invVendor;

        let pay_vendor_invoice = function () {
            let inParams = [];
            inParams.push([invVendor]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(1);
            fparams.push('root');
            fparams.push('account.move'); //model
            fparams.push('pay_vendor_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        //console.log(err, "Error pay_vendor_invoice");
                        notificationError$.next({ type: 13 });
                    } else {
                        if (result) {
                            //console.log("pago correcto", result);
                            task$.next({ type: 17 });
                        } else {
                            notificationError$.next({ type: 13 });
                        }
                    }
                }
            );
        };

        let create_PO_invoice = function () {
            //const id_po = flow.get('PO')
            let inParams = [];
            inParams.push([Po_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('create_full_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error create_PO_invoice')
                        notificationError$.next({ type: 13 });
                    } else {
                        invVendor = value;
                        pay_vendor_invoice();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                } else {
                    create_PO_invoice();
                    //search_payment_acquirer_fields();
                }
            }
        );
    }

    // payProviderCash(Po_id) {
    //   let create_PO_invoice = function () {
    //     //const id_po = flow.get('PO')
    //     let inParams = []
    //     inParams.push([Po_id])
    //     let params = []
    //     params.push(inParams)

    //     let fparams = []
    //     fparams.push(jaysonServer.db)
    //     fparams.push(user.id)
    //     fparams.push(jaysonServer.password)
    //     fparams.push('purchase.order') //model
    //     fparams.push('create_full_invoice') //method

    //     for (let i = 0; i < params.length; i++) {
    //       fparams.push(params[i])
    //     }

    //     client.request(
    //       'call',
    //       { service: 'object', method: 'execute_kw', args: fparams },
    //       function (err, error, value) {
    //         if (err) {
    //           //console.log(err, 'Error create_PO_invoice')
    //           notificationError$.next({ type: 13 })
    //         } else {
    //           task$.next({ type: 17 })
    //         }
    //       },
    //     )
    //   }

    //   let set_finish_true = () => {
    //     let inParams = []
    //     inParams.push([Po_id])
    //     inParams.push({ finish: true })
    //     let params = []
    //     params.push(inParams)

    //     let fparams = []
    //     fparams.push(jaysonServer.db)
    //     fparams.push(user.id)
    //     fparams.push(jaysonServer.password)
    //     fparams.push('write') //model
    //     fparams.push('purchase.order') //method

    //     for (let i = 0; i < params.length; i++) {
    //       fparams.push(params[i])
    //     }

    //     client.request(
    //       'call',
    //       { service: 'object', method: 'execute_kw', args: fparams },
    //       function (err, error, value) {
    //         if (err) {
    //           ////console.log(err, "Error create_SO_invoice");

    //           notificationError$.next({ type: 13 })
    //         } else {
    //           ////console.log(invClient, "Correcto create_SO_invoice");
    //           create_PO_invoice()
    //         }
    //       },
    //     )
    //   }

    //   let client = jayson.https({
    //     host: jaysonServer.host,
    //     port: jaysonServer.port + jaysonServer.pathConnection,
    //   })
    //   client.request(
    //     'call',
    //     {
    //       service: 'common',
    //       method: 'login',
    //       args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
    //     },
    //     function (err, error, value) {
    //       if (err || !value) {
    //         notificationError$.next({ type: 0 })
    //       } else {
    //         set_finish_true()
    //         //search_payment_acquirer_fields();
    //       }
    //     },
    //   )
    // }

    payProviderCash(Po_id) {
        let invVendor;

        let pay_vendor_invoice = function () {
            let inParams = [];
            inParams.push([invVendor]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(1);
            fparams.push('root');
            fparams.push('account.move'); //model
            fparams.push('pay_vendor_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, result) {
                    if (err) {
                        //console.log(err, "Error pay_vendor_invoice");
                        notificationError$.next({ type: 13 });
                    } else {
                        if (result) {
                            //console.log("pago correcto", result);
                            task$.next({ type: 17 });
                        } else {
                            notificationError$.next({ type: 13 });
                        }
                    }
                }
            );
        };

        let create_PO_invoice = function () {
            //const id_po = flow.get('PO')
            let inParams = [];
            inParams.push([Po_id]);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('create_full_invoice'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error create_PO_invoice')
                        notificationError$.next({ type: 13 });
                    } else {
                        invVendor = value;
                        pay_vendor_invoice();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                } else {
                    create_PO_invoice();
                    //search_payment_acquirer_fields();
                }
            }
        );
    }

    aplicationListEdit(
        So_id?: number,
        type?: number,
        Task?: TaskModel,
        Up_Offer?: any,
        Up_Chat?: any
    ) {
        switch (type) {
            case 1:
                //////////////////////////eliminar solicitud
                temp = applicationList.findIndex((element) => element.So_id === So_id);
                if (temp !== -1) {
                    applicationList.splice(temp, 1);
                }
                break;
            case 2:
                temp = applicationList.findIndex((element) => element.So_id === Task.So_id);
                if (temp != -1) {
                    applicationList[temp].notificationNewSo = false;
                    applicationList[temp].notificationNewOffert = false;
                    applicationList[temp].notificationNewChat = false;

                    for (let new_budget_po_id of Task.So_offers) {
                        Task.Po_id_new_budget.push(new_budget_po_id.Po_id);
                    }

                    this.applicationListEditOdoo(Task);
                } else {
                    temp = hiredList.findIndex((element) => element.So_id === Task.So_id);

                    if (temp != -1) {
                        hiredList[temp].notificationNewSo = false;
                        hiredList[temp].notificationNewChat = false;
                        Task.Po_id_new_budget.push(Task.Po_id);
                        this.applicationListEditOdoo(Task);
                    }
                }
                break;
            case 3:
                //!subir los nuevos chats
                temp = applicationList.findIndex((element) => element.So_id === So_id);
                if (temp != -1) {
                    let temp1 = applicationList[temp].So_offers.findIndex(
                        (element) => element.Po_id === Task.Po_id
                    );
                    if (temp1 != -1) {
                        applicationList[temp].So_offers[temp1].messageList = Task.messageList;
                    }
                }

                temp = hiredList.findIndex((element) => element.So_id === So_id);
                if (temp != -1) {
                    hiredList[temp].messageList = Task.messageList;
                }

                break;
            case 4:
                for (let offer of Up_Offer) {
                    temp = applicationList.findIndex(
                        (element) => element.So_origin === offer.origin
                    );

                    if (temp != -1) {
                        applicationList[temp].notificationNewOffert = true;
                        applicationList[temp].Up_coming_Offer.push(offer.PO_id);
                    }
                }

                break;
            case 5:
                for (let [index, message] of Up_Chat.entries()) {
                    temp = applicationList.findIndex((element) => element.So_id === message.SO_id);

                    if (temp != -1) {
                        applicationList[temp].notificationNewChat = true;

                        for (let application of applicationList[temp].So_offers) {
                            application.Up_coming_Chat.push({
                                Po_id: message.PO_id,
                                messageID: message.messageId,
                            });
                        }
                        Up_Chat.splice(index, 1);
                    }
                }

                for (let [index, message] of Up_Chat.entries()) {
                    temp = hiredList.findIndex((element) => element.So_id === message.SO_id);
                    ////console.log(temp, 'resultado')
                    if (temp != -1) {
                        //hiredList[temp].notificationNewSo = false;
                        hiredList[temp].notificationNewChat = true;
                        hiredList[temp].Up_coming_Chat.push({
                            Po_id: message.PO_id,
                            messageID: message.messageId,
                        });

                        Up_Chat.splice(index, 1);
                    }
                }

                if (typeof Up_Chat !== 'undefined' && Up_Chat.length > 0) {
                    for (let message of Up_Chat) {
                        notifications$.next(true);
                        notificationBoolean = true;

                        if (message.state != 'purchase') {
                            notificationArray.unshift({
                                type: 3,
                                task: message.PO_id,
                                upload: 1,
                                hired: false,
                            });
                        } else {
                            notificationArray.unshift({
                                type: 3,
                                task: message.PO_id,
                                upload: 1,
                                hired: true,
                            });
                        }
                    }
                }

                break;
            case 6:
                ///quitar de solicitudes y poner contratadas
                temp = applicationList.findIndex((element) => element.So_id === So_id);
                if (temp != -1) {
                    applicationList[temp].photoProvider = Task.photoProvider;
                    applicationList[temp].opinions_provider = Task.opinions_provider;
                    applicationList[temp].provider_name = Task.provider_name;
                    applicationList[temp].provider_id = Task.provider_id;
                    applicationList[temp].messageList = Task.messageList;
                    applicationList[temp].Po_id = Task.Po_id;
                    applicationList[temp].materials = Task.materials;
                    applicationList[temp].work_force = Task.work_force;
                    applicationList[temp].notificationNewSo = true;

                    hiredList.unshift(applicationList[temp]);
                    applicationList.splice(temp, 1);
                }

                break;
            case 7:
                //console.log("entrando a finalizar tarea")
                temp = hiredList.findIndex((element) => element.So_id === So_id);
                if (temp != -1) {
                    //console.log("tarea finalizadas encontrada")
                    recordList.unshift(hiredList[temp]);
                    hiredList.splice(temp, 1);
                }

                break;
        }
    }

    applicationListEditOdoo(Task: TaskModel) {
        ////console.log(Task, "para actualizar");
        let count: number;

        let get_update_po = () => {
            ////console.log("actualizando Po")
            let inParams = [];
            inParams.push([Task.Po_id_new_budget[count]]); //id to update
            inParams.push({
                new_budget: false,
            }); //to activate set to true
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('purchase.order'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error actualizando PO')
                        //notificationError$.next({ type: 1 });
                    } else {
                        count--;
                        if (count >= 0) {
                            get_update_po();
                        }
                    }
                }
            );
        };

        let get_update_so = () => {
            let inParams = [];
            inParams.push([Task.So_id]); //id to update
            inParams.push({
                new_created: false,
                new_chat: false,
            }); //to activate set to true
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error actualizando PO')
                        //notificationError$.next({ type: 1 });
                    } else {
                        if (
                            typeof Task.Po_id_new_budget !== 'undefined' &&
                            Task.Po_id_new_budget.length > 0
                        ) {
                            count = Task.Po_id_new_budget.length - 1;
                            get_update_po();
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_update_so();
                }
            }
        );
    }

    requestPhotoSo(Task: TaskModel) {
        let get_photo_so = () => {
            let inParams = [];
            inParams.push([['res_id', '=', Task.So_id]]);
            inParams.push(['name', 'res_id', 'res_model', 'url', 'datas', 'mimetype', 'file_size']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error get_photo_so');
                        notificationError$.next({ type: 9 });
                    } else {
                        if (typeof value !== 'undefined' && value.length > 0) {
                            let tempTask;

                            for (let resId of value) {
                                let temp = applicationList.findIndex(
                                    (element) => element.So_id === resId.res_id
                                );
                                if (temp !== -1) {
                                    if (applicationList[temp].So_id === resId.res_id) {
                                        if (knownTypes[resId.datas[0]]) {
                                            applicationList[temp].photoSO.push(
                                                knownTypes[resId.datas[0]] + resId.datas
                                            );
                                            applicationList[temp].downloadPhotoSo = true;
                                            tempTask = applicationList[temp];
                                        }
                                    }
                                }
                            }

                            task$.next({ type: 8, task: tempTask });
                            ////console.log(tempTask, 'so con fotos')
                        } else {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === Task.So_id
                            );
                            if (temp !== -1) {
                                applicationList[temp].downloadPhotoSo = true;
                            }
                            task$.next({ type: 11 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_photo_so();
                }
            }
        );
    }

    requestPhotoSoHired(Task: TaskModel) {
        let tempTask;
        let get_photo_so = () => {
            let inParams = [];
            inParams.push([['res_id', '=', Task.So_id]]);
            inParams.push(['name', 'res_id', 'res_model', 'url', 'datas', 'mimetype', 'file_size']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error get_photo_so');
                        notificationError$.next({ type: 9 });
                    } else {
                        //console.log(value, "fotos")

                        if (typeof value !== 'undefined' && value.length > 0) {
                            for (let resId of value) {
                                let temp = hiredList.findIndex(
                                    (element) => element.So_id === resId.res_id
                                );
                                if (temp !== -1) {
                                    if (hiredList[temp].So_id === resId.res_id) {
                                        if (knownTypes[resId.datas[0]]) {
                                            //console.log("foto obtenida")

                                            hiredList[temp].photoSO.push(
                                                knownTypes[resId.datas[0]] + resId.datas
                                            );
                                            hiredList[temp].downloadPhotoSo = true;
                                            tempTask = hiredList[temp];
                                        }
                                    }
                                }
                            }

                            task$.next({ type: 8, task: tempTask });

                            //console.log(tempTask, "so con fotos");
                        } else {
                            task$.next({ type: 11, task: tempTask });

                            //console.log(tempTask,"no tiene fotos fotos");
                        }

                        ///
                    }
                }
            );
        };

        let search_avatar_provider = () => {
            let inParams = [];

            inParams.push([['partner_id', '=', Task.provider_id]]);
            inParams.push(['partner_id', 'image_1920', 'ranking']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error search_avatar_provider');
                        notificationError$.next({ type: 9 });
                    } else {
                        //console.log(value, 'avatar')
                        //	//console.log(hiredList, "hiredList");

                        if (typeof value !== 'undefined' && value.length > 0) {
                            ////console.log(hiredList, "hiredList");
                            for (let resId of value) {
                                ////console.log(hiredList, "hiredList");
                                for (let task of hiredList) {
                                    if (task.So_id === Task.So_id) {
                                        if (knownTypes[resId.image_1920[0]]) {
                                            task.photoProvider =
                                                knownTypes[resId.image_1920[0]] + resId.image_1920;
                                            task.downloadPhotoSo = true;
                                            tempTask = task;
                                        }
                                    }
                                }
                            }
                        }

                        //
                        // let temp = hiredList.findIndex((element) => element.So_id === Task.So_id);
                        // if (temp !== -1) {
                        // 	hiredList[temp].downloadPhotoSo = true;
                        // 	task$.next({ type: 11, task: hiredList[temp] });
                        // }
                        //!!info de los providers
                        get_photo_so();
                        ////console.log(tempInfo, "tareas con avatar")
                        ////////////////////////filtrado
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    search_avatar_provider();
                }
            }
        );
    }

    requestPhotoWorkerHired(Task: TaskModel) {
        ////console.log('buscando fotos servicios', Task);
        let tempTask;
        let get_photo_so = () => {
            let inParams = [];
            inParams.push([['res_id', '=', Task.So_id]]);
            inParams.push(['name', 'res_id', 'res_model', 'url', 'datas', 'mimetype', 'file_size']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error get_photo_so');
                        notificationError$.next({ type: 9 });
                    } else {
                        ////console.log(value, "fotos")

                        if (typeof value !== 'undefined' && value.length > 0) {
                            for (let resId of value) {
                                if (knownTypes[resId.datas[0]]) {
                                    hiredList[temp].photoSO.push(
                                        knownTypes[resId.datas[0]] + resId.datas
                                    );
                                    hiredList[temp].downloadPhotoSo = true;
                                    tempTask = hiredList[temp];
                                }
                            }

                            task$.next({ type: 8, task: tempTask });

                            ////console.log(tempTask, "so con fotos");
                        } else {
                            task$.next({ type: 11, task: tempTask });

                            ////console.log("no tiene fotos fotos");
                        }

                        ///
                    }
                }
            );
        };

        let search_avatar_provider = () => {
            let inParams = [];

            inParams.push([['partner_id', '=', Task.provider_id]]);
            inParams.push(['partner_id', 'image_1920', 'ranking']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error search_avatar_provider');
                        notificationError$.next({ type: 9 });
                    } else {
                        ////console.log(value, "avatar");
                        //	//console.log(hiredList, "hiredList");

                        if (typeof value !== 'undefined' && value.length > 0) {
                            ////console.log(hiredList, "hiredList");
                            for (let resId of value) {
                                ////console.log(hiredList, "hiredList");
                                for (let task of hiredList) {
                                    if (task.So_id === Task.So_id) {
                                        if (knownTypes[resId.image_1920[0]]) {
                                            task.photoProvider =
                                                knownTypes[resId.image_1920[0]] + resId.image_1920;
                                            task.downloadPhotoSo = true;
                                            tempTask = task;
                                        }
                                    }
                                }
                            }
                        }

                        //
                        // let temp = hiredList.findIndex((element) => element.So_id === Task.So_id);
                        // if (temp !== -1) {
                        // 	hiredList[temp].downloadPhotoSo = true;
                        // 	task$.next({ type: 11, task: hiredList[temp] });
                        // }
                        //!!info de los providers
                        get_photo_so();
                        ////console.log(tempInfo, "tareas con avatar")
                        ////////////////////////filtrado
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    search_avatar_provider();
                }
            }
        );
    }

    requestMoreInfoProvider(SO_id: number, provider_id: number, offsetComment: number) {
        //console.log(offsetComment, 'requestMoreInfoProvider');
        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([
                ['notified_partner_ids', '=', provider_id],
                ['message_type', '=', 'ranking'],
            ]);
            inParams.push(['notified_partner_ids', 'body', 'ranking', 'author_id']);
            let params = [];
            params.push(inParams);

            params.push({ offset: offsetComment, limit: 2 });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('mail.message'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        notificationError$.next({ type: 15 });
                    } else {
                        // console.log(value, 'comentarios');

                        if (value !== 'undefined' && value.length > 0) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === SO_id
                            );
                            if (temp !== -1) {
                                let temp1 = applicationList[temp].So_offers.findIndex(
                                    (element) => element.provider_id === provider_id
                                );
                                if (temp1 !== -1) {
                                    for (let resId of value) {
                                        const coment: Comments = {
                                            author: resId.author_id[1],
                                            comment: resId.body.slice(3, resId.body.length - 4),
                                            ranking: resId.ranking,
                                        };
                                        applicationList[temp].So_offers[
                                            temp1
                                        ].opinions_provider.push(coment);
                                    }
                                }
                            }
                            task$.next({ type: 19 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient')
                } else {
                    list_msg_ids();
                }
            }
        );
    }

    getProvidersInfoOffer(provider_id: any[], SO_id: number) {
        let coment: Comments;

        console.log(provider_id, 'id provider');
        console.log(jaysonServer, 'jayson Server');

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([
                ['notified_partner_ids', 'in', provider_id],
                ['message_type', '=', 'ranking'],
            ]);
            inParams.push(['notified_partner_ids', 'body', 'ranking', 'author_id']);
            let params = [];
            params.push(inParams);

            params.push({ offset: 0, limit: 2 });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('mail.message'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        notificationError$.next({ type: 5 });
                    } else {
                        console.log(value, 'message del provider with comment');

                        if (value !== 'undefined' && value.length > 0) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === SO_id
                            );
                            if (temp !== -1) {
                                for (let resId of value) {
                                    let temp1 = applicationList[temp].So_offers.findIndex(
                                        (element) =>
                                            element.provider_id ===
                                            resId.notified_partner_ids[
                                                resId.notified_partner_ids.length - 1
                                            ]
                                    );
                                    if (temp1 !== -1) {
                                        coment = {
                                            author: resId.author_id[1],
                                            comment: resId.body.slice(3, resId.body.length - 4),
                                            ranking: resId.ranking,
                                        };

                                        // console.log("entro",coment);
                                        applicationList[temp].So_offers[
                                            temp1
                                        ].opinions_provider.push(coment);
                                    }
                                }
                            }
                        }
                        // console.log(applicationList[countTest].So_offers,"ofertas Comentarios")
                        task$.next({ type: 5 });
                    }
                }
            );
        };

        let search_avatar_provider = () => {
            let inParams = [];

            inParams.push([['partner_id', 'in', provider_id]]);
            inParams.push(['partner_id', 'image_1920', 'ranking']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error search_avatar_provider');
                        notificationError$.next({ type: 5 });
                    } else {
                        ////console.log(value, "avatar");

                        if (value) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === SO_id
                            );
                            if (temp !== -1) {
                                for (let resId of value) {
                                    for (let offer of applicationList[temp].So_offers) {
                                        if (offer.provider_id === resId.partner_id[0]) {
                                            if (knownTypes[resId.image_1920[0]]) {
                                                offer.photoProvider =
                                                    knownTypes[resId.image_1920[0]] +
                                                    resId.image_1920;
                                                offer.provider_name = resId.partner_id[1];
                                                offer.ranking_provider = resId.ranking;
                                                //tempInfo.push(offer);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //!!info de los providers
                        list_msg_ids();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    console.log(err, 'requestTaskListClient');
                } else {
                    search_avatar_provider();
                }
            }
        );
    }

    requestPo(Po_id: number[], SO_id: number) {
        console.log('requestPo');

        let newTaskModel = new TaskModel();
        let tempTask: TaskModel[] = [];
        let providerId: number[] = [];

        let list_msg_ids = () => {
            ////console.log("provider id comentarios", providerId);
            let inParams = [];
            inParams.push([
                ['notified_partner_ids', 'in', providerId],
                ['message_type', '=', 'ranking'],
            ]);
            inParams.push(['notified_partner_ids', 'body', 'ranking', 'author_id']);
            let params = [];
            params.push(inParams);
            params.push({ offset: 0, limit: 2 });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 5 });
                    } else {
                        ////console.log(value, "informacion comentarios del proveedor");

                        if (value) {
                            for (let resId of value) {
                                let temp = applicationList.findIndex(
                                    (element) => element.So_id === SO_id
                                );
                                if (temp !== -1) {
                                    for (let offer of applicationList[temp].So_offers) {
                                        if (offer.provider_id === resId.notified_partner_ids[0]) {
                                            let coment: Comments = {
                                                author: resId.author_id[1],
                                                comment: resId.body,
                                                ranking: resId.ranking,
                                            };
                                            offer.opinions_provider.push(coment);
                                            ////console.log(applicationList[temp], 'Donde puse la info')
                                            //tempInfo.push(offer);
                                        }
                                    }
                                }
                            }

                            for (let poId of Po_id) {
                                let temp1 = applicationList.findIndex(
                                    (element) => element.So_id === SO_id
                                );
                                if (temp1 !== -1) {
                                    let temp = applicationList[temp1].So_offers.findIndex(
                                        (element) => element.Po_id === poId
                                    );
                                    if (temp !== -1) {
                                        //console.log(applicationList[temp], 'Cuando no hay info')

                                        tempTask.push(applicationList[temp1].So_offers[temp]);
                                    }
                                }
                            }
                        } else {
                            for (let poId of Po_id) {
                                let temp1 = applicationList.findIndex(
                                    (element) => element.So_id === SO_id
                                );
                                if (temp1 !== -1) {
                                    let temp = applicationList[temp1].So_offers.findIndex(
                                        (element) => element.Po_id === poId
                                    );
                                    if (temp !== -1) {
                                        ////console.log("encontrada")
                                        tempTask.push(applicationList[temp1].So_offers[temp]);
                                    }
                                }
                            }
                        }

                        ////console.log(tempTask, ' comentarios del usuario')
                        task$.next({ type: 10 });
                    }
                }
            );
        };

        let search_avatar_provider = () => {
            ////console.log(providerId, 'avatar partner id de la po por notificacion')

            let inParams = [];
            inParams.push([['partner_id', 'in', providerId]]);
            inParams.push(['partner_id', 'image_1920', 'ranking']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error search_avatar_provider');
                        //notificationError$.next({ type: 5 });
                    } else {
                        ////console.log(value, "avatar de la po por notificacion");

                        if (value) {
                            for (let resId of value) {
                                for (let task of applicationList) {
                                    for (let offer of task.So_offers) {
                                        if (offer.provider_id === resId.partner_id[0]) {
                                            if (knownTypes[resId.image_1920[0]]) {
                                                offer.photoProvider =
                                                    knownTypes[resId.image_1920[0]] +
                                                    resId.image_1920;
                                                offer.provider_name = resId.partner_id[1];
                                                offer.ranking_provider = resId.ranking;
                                                //tempTask.push(offer);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //!!info de los providers
                        list_msg_ids();
                        ////console.log(tempInfo, "tareas con avatar")
                        ////////////////////////filtrado
                    }
                }
            );
        };

        let get_order_line = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', Po_id]]);
            inParams.push(['product_id', 'product_qty', 'price_unit']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_po_list');
                        //notificationError$.next({ type: 1 });
                    } else {
                        //////console.log(value, "order Line")

                        for (let orderLine of value) {
                            for (let task of applicationList) {
                                for (let offer of task.So_offers) {
                                    for (let line of offer.Po_order_line) {
                                        //////console.log(line, "lineas");
                                        if (line === orderLine.id) {
                                            switch (orderLine.product_id[0]) {
                                                // case 39:

                                                // 	task.type = "Servicio de Fontanería"
                                                // 	break;

                                                case 40:
                                                    offer.work_force += orderLine.price_unit;
                                                    break;

                                                case 41:
                                                    offer.materials += orderLine.price_unit;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }

                            // for (let task of hiredList) {
                            // 	for (let line of task.Po_order_line) {
                            // 		if (line === orderLine.id) {
                            // 			switch (orderLine.product_id[0]) {
                            // 				case 40:
                            // 					task.work_force += orderLine.price_unit;
                            // 					break;

                            // 				case 41:
                            // 					task.materials += orderLine.price_unit;
                            // 					break;
                            // 			}
                            // 		}
                            // 	}
                            // }
                        }
                        search_avatar_provider();
                        //get_photo_so();
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['id', 'in', Po_id]]);
            inParams.push(['partner_id', 'origin', 'order_line']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        //notificationError$.next({ type: 1 });
                    } else {
                        //////console.log(value, "Po")

                        for (let task of applicationList) {
                            let temp = value.find((element) => element.origin === task.So_origin);
                            if (temp) {
                                newTaskModel = new TaskModel();
                                //provider_partner_id.push(temp['partner_id'][0]);
                                newTaskModel.provider_id = temp['partner_id'][0];
                                providerId.push(temp['partner_id'][0]);
                                newTaskModel.provider_name = temp['partner_id'][1];
                                newTaskModel.Po_id = temp['id'];
                                newTaskModel.So_id = task.So_id;
                                newTaskModel.notificationNewOffert = true;
                                //newTaskModel.So_origin = temp['origin'];
                                newTaskModel.Po_order_line = temp['order_line'];
                                //task.budget = temp['amount_total'];
                                //task.origin = temp['origin'];
                                task.So_offers.push(newTaskModel);
                                task.Up_coming_Offer = [];
                                taskCesar.Up_coming_Offer = [];
                                task.Up_coming_Chat = [];
                                taskCesar.Up_coming_Chat = [];
                            }
                        }

                        get_order_line();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    //notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_po_of_task();
                }
            }
        );
    }

    updateDateSo(Task: TaskModel) {
        let get_update_so = () => {
            let inParams = [];
            inParams.push([Task.So_id]); //id to update
            inParams.push({
                commitment_date: Task.date_planned,
            }); //to activate set to true
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('sale.order'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error actualizando SO_Date')
                        notificationError$.next({ type: 11 });
                    } else {
                        temp = applicationList.findIndex((element) => element.So_id === Task.So_id);

                        if (temp != -1) {
                            applicationList[temp].date_planned = Task.date_planned;
                        } else {
                            temp = hiredList.findIndex((element) => element.So_id === Task.So_id);
                            if (temp != -1) {
                                hiredList[temp].date_planned = Task.date_planned;
                            }
                        }

                        task$.next({ type: 15 });
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_update_so();
                }
            }
        );
    }

    searchTittleSo(So_id) {
        temp = applicationList.findIndex((element) => element.So_id === So_id);

        if (temp != -1) {
            return applicationList[temp];
        } else {
            temp = hiredList.findIndex((element) => element.So_id === So_id);
            if (temp != -1) {
                return hiredList[temp];
            }
        }
    }

    setNewNotification(any) {
        notificationArray.unshift(any);
        notifications$.next(true);
        notificationBoolean = true;
    }

    setProviderComment(PO_id: number, comment: Comments) {
        //console.log(PO_id,"donde voy a guardar el mensaje");
        //console.log(comment,"comentario");

        let set_comment = () => {
            let inParams = [];
            inParams.push([PO_id]); //id to update
            let params = [];
            params.push(inParams);
            params.push({
                body: comment.comment,
                message_type: 'ranking',
                subtype_id: 1,
                ranking: comment.ranking,
            });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('purchase.order'); //model
            fparams.push('message_post'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }
            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error actualizando SO_Date')
                        notificationError$.next({ type: 14 });
                    } else {
                        //console.log('Exitos subiendo opinion')
                        task$.next({ type: 18 });
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                } else {
                    set_comment();
                }
            }
        );
    }

    requestApplicationTaskAnonimus() {
        let SO_origin = [];
        let PO_id = [];
        let SO_id = [];

        applicationList = [];

        let newTaskModel = new TaskModel();

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([PO_id]);
            inParams.push([
                ['res_id', 'in', PO_id],
                ['message_type', '!=', 'ranking'],
            ]);
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error list_msg_ids");
                        notificationError$.next({ type: 2 });
                    } else {
                        //////console.log(value, "messages")
                        value = value.filter((messages) => {
                            return (
                                messages.subtype_id === false ||
                                messages.subtype_id[1] === 'Discussions'
                            );
                        });
                        value.reverse();

                        for (let task of applicationList) {
                            for (let offer of task.So_offers) {
                                for (let message of value) {
                                    if (message.res_id === offer.Po_id) {
                                        let tempMessage: MessageModel = new MessageModel(
                                            message['body'].slice(3, message['body'].length - 4),
                                            message['author_id'][1],
                                            message['author_id'][0],
                                            message['res_id']
                                        );
                                        offer.messageList.push(tempMessage);
                                    }
                                }
                            }
                        }
                        // ////console.log(applicationList);
                        // ////console.log(hiredList)

                        //console.log(applicationList, 'nuevas en el servicio');
                        //                 task$.next({ type: 1, task: applicationList });
                        task$.next({ type: 1 });
                    }
                }
            );
        };

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let task of applicationList) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);
                            task.type = temp.product_id[1];
                        }
                        list_msg_ids();
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);
            inParams.push([
                'partner_id',
                'origin',
                'order_line',
                'state',
                'name',
                'new_budget',
                'amount_total',
            ]);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 2 });
                    } else {
                        //console.log(value, "Po asociadas a anonimas")

                        value = value.filter((po) => {
                            return po.state === 'sent';
                        });

                        for (let task of applicationList) {
                            for (let offert of value) {
                                if (task.So_origin === offert.origin) {
                                    //console.log("entre");
                                    newTaskModel = new TaskModel();
                                    task.notificationNewOffert = offert['new_budget'];
                                    //provider_partner_id.push(temp['partner_id'][0]);
                                    newTaskModel.provider_id = offert['partner_id'][0];
                                    newTaskModel.provider_name = offert['partner_id'][1];
                                    newTaskModel.notificationNewOffert = offert['new_budget'];
                                    newTaskModel.Po_id = offert['id'];
                                    newTaskModel.So_id = task.So_id;
                                    PO_id.push(offert['id']);
                                    newTaskModel.Po_order_line = offert['order_line'];
                                    newTaskModel.So_budget = offert['amount_total'];
                                    task.So_offers.push(newTaskModel);
                                }
                            }
                        }
                        //console.log(applicationList,"lista con po en sent")
                        get_so_type();
                    }
                }
            );
        };

        let get_so_list = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', 217],
                ['invoice_status', '=', 'to invoice'],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                //'require_materials',
                //'commitment_date',
                'address_street',
                // 'address_floor',
                // 'address_portal',
                // 'address_number',
                // 'address_door',
                // 'address_stairs',
                // 'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                'anonimus_author',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetApplication, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        // console.log(value, 'anonimus list');
                        offsetApplication += limit;

                        for (let order of value) {
                            let temp = new TaskModel();

                            // if (order['invoice_status'] === 'invoiced') {
                            // 	//contratados_id.push(order['name']);
                            // }
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            temp.description = order['note'];
                            //temp.type = order['client_order_ref'];
                            temp.anonimus_author = order['anonimus_author'];
                            //temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            //temp.require_materials = order['require_materials'];
                            //temp.date_created = order['date_order'];
                            temp.date_planned = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['date_order']);
                            temp.notificationNewChat = order['new_chat'];
                            //temp.notificationNewOffert = order['po_agreement'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            applicationList.push(temp);
                        }
                        if (applicationList && applicationList.length) {
                            get_po_of_task();
                            // console.log('************* applicationList *************');
                            // console.log(applicationList);
                        } else {
                            //!Actualizar observable

                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, 'anonimo@example.com', 'anonimo'],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list();
                }
            }
        );
    }

    requestMoreApplicationTaskAnonimus() {
        let SO_origin = [];
        let PO_id = [];
        let SO_id = [];

        let applicationListTemp: TaskModel[] = [];

        let newTaskModel = new TaskModel();

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([PO_id]);
            inParams.push([
                ['res_id', 'in', PO_id],
                ['message_type', '!=', 'ranking'],
            ]);
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('purchase.order'); //model
            fparams.push('search_messages'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, "Error list_msg_ids");
                        notificationError$.next({ type: 2 });
                    } else {
                        //////console.log(value, "messages")
                        value = value.filter((messages) => {
                            return (
                                messages.subtype_id === false ||
                                messages.subtype_id[1] === 'Discussions'
                            );
                        });
                        value.reverse();

                        for (let task of applicationListTemp) {
                            for (let offer of task.So_offers) {
                                for (let message of value) {
                                    if (message.res_id === offer.Po_id) {
                                        let tempMessage: MessageModel = new MessageModel(
                                            message['body'].slice(3, message['body'].length - 4),
                                            message['author_id'][1],
                                            message['author_id'][0],
                                            message['res_id']
                                        );
                                        offer.messageList.push(tempMessage);
                                    }
                                }
                            }
                        }
                        applicationList = [].concat(applicationList, applicationListTemp);
                        // console.log(applicationList, 'nuevas en el servicio');
                        task$.next({ type: 2, task: applicationListTemp });
                    }
                }
            );
        };

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', 'in', SO_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        for (let task of applicationListTemp) {
                            let temp = value.find((element) => element.order_id[0] === task.So_id);
                            task.type = temp.product_id[1];
                        }
                        list_msg_ids();
                    }
                }
            );
        };

        let get_po_of_task = () => {
            let inParams = [];
            inParams.push([['origin', 'in', SO_origin]]);
            inParams.push([
                'partner_id',
                'origin',
                'order_line',
                'state',
                'name',
                'new_budget',
                'amount_total',
            ]);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');
            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'Error requestOffersForTask');
                        notificationError$.next({ type: 2 });
                    } else {
                        //console.log(value, "Po asociadas a anonimas")

                        value = value.filter((po) => {
                            return po.state === 'sent';
                        });

                        for (let task of applicationListTemp) {
                            for (let offert of value) {
                                if (task.So_origin === offert.origin) {
                                    //console.log("entre");
                                    newTaskModel = new TaskModel();
                                    task.notificationNewOffert = offert['new_budget'];
                                    //provider_partner_id.push(temp['partner_id'][0]);
                                    newTaskModel.provider_id = offert['partner_id'][0];
                                    newTaskModel.provider_name = offert['partner_id'][1];
                                    newTaskModel.notificationNewOffert = offert['new_budget'];
                                    newTaskModel.Po_id = offert['id'];
                                    newTaskModel.So_id = task.So_id;
                                    PO_id.push(offert['id']);
                                    newTaskModel.Po_order_line = offert['order_line'];
                                    newTaskModel.So_budget = offert['amount_total'];
                                    task.So_offers.push(newTaskModel);
                                }
                            }
                        }
                        //console.log(applicationList,"lista con po en sent")
                        get_so_type();
                    }
                }
            );
        };

        let get_so_list = () => {
            let inParams = [];
            inParams.push([
                ['partner_id', '=', 217],
                ['invoice_status', '=', 'to invoice'],
            ]);
            inParams.push([
                'invoice_status',
                'partner_id',
                'date_order',
                'name',
                'note',
                //'client_order_ref',
                'title',
                //'require_materials',
                //'commitment_date',
                'address_street',
                // 'address_floor',
                // 'address_portal',
                // 'address_number',
                // 'address_door',
                // 'address_stairs',
                // 'address_zip_code',
                'address_latitude',
                'address_longitude',
                'new_created',
                'new_chat',
                'anonimus_author',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetApplication, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push('anonimo');

            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        ////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 2 });
                    } else {
                        // console.log(value, 'anonimus list');
                        offsetApplication += limit;

                        for (let order of value) {
                            let temp = new TaskModel();

                            // if (order['invoice_status'] === 'invoiced') {
                            // 	//contratados_id.push(order['name']);
                            // }
                            SO_id.push(order['id']);
                            SO_origin.push(order['name']);
                            temp.description = order['note'];
                            //temp.type = order['client_order_ref'];
                            temp.anonimus_author = order['anonimus_author'];
                            //temp.client_id = order['partner_id'][0];
                            temp.client_name = order['partner_id'][1];
                            temp.So_origin = order['name'];
                            temp.So_id = order['id'];
                            temp.title = order['title'];
                            //temp.require_materials = order['require_materials'];
                            //temp.date_created = order['date_order'];
                            temp.date_planned = String(order['date_order']).slice(0, 10);
                            temp.time_created = String(order['date_order']).slice(0, 10);
                            temp.time = String(order['date_order']);
                            temp.notificationNewChat = order['new_chat'];
                            //temp.notificationNewOffert = order['po_agreement'];
                            temp.notificationNewSo = order['new_created'];
                            temp.address = new Address(
                                order['address_street'],
                                order['address_number'],
                                order['address_portal'],
                                order['address_stairs'],
                                order['address_floor'],
                                order['address_door'],
                                order['address_zip_code'],
                                order['address_latitude'],
                                order['address_longitude'],
                                order['distance']
                            );
                            applicationListTemp.push(temp);
                        }
                        if (
                            typeof applicationListTemp !== 'undefined' &&
                            applicationListTemp.length
                        ) {
                            get_po_of_task();
                        } else {
                            //!Actualizar observable
                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, 'anonimo@example.com', 'anonimo'],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    get_so_list();
                }
            }
        );
    }

    newTaskAnonimus(task: TaskModel) {
        let jaysonServer = {
            //host: '192.168.0.102',
            //host: '192.168.0.107',
            host: 'odoo.todoenunapp.com',
            //host: 'localhost',
            port: '443',
            //port: '8069',
            db: 'demo',
            username: 'anonimo@example.com',
            password: 'anonimo',
            pathConnection: '/jsonrpc',
        };

        let user = new UsuarioModel();
        user.partner_id = 217;
        user.id = 129;
        user.password = 'anonimo';

        //let count: number;

        let get_so_type = () => {
            let inParams = [];
            inParams.push([['order_id', '=', task.So_id]]);
            inParams.push(['product_id', 'order_id']);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order.line'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        ////console.log(err, 'Error get_so_list');
                        notificationError$.next({ type: 8 });
                    } else {
                        task.type = value[0].product_id[1];

                        if (typeof applicationList !== 'undefined' && applicationList.length > 0) {
                            applicationList.unshift(task);
                        }

                        task$.next({ type: 7 });
                    }
                }
            );
        };

        let obtainSo_origin = function (SO_id: number) {
            let inParams = [];
            inParams.push([['id', '=', SO_id]]);
            inParams.push(['name']);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error get_So_by_id');
                        notificationError$.next({ type: 8 });
                    } else {
                        task.So_origin = value[0]['name'];
                        task.notificationNewSo = true;
                        //task.photoSO = task.photoSO.filter(Boolean);
                        //task.downloadPhotoSo = true;
                        get_so_type();
                        //notificationNewSoClient$.next(true);
                    }
                }
            );
        };

        let confirmService = function (SO_id: number) {
            let inParams = [];
            inParams.push(SO_id);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('action_confirm'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error Confirmar Servicio Creado');
                        //notificationError$.next(true);
                        notificationError$.next({ type: 8 });
                    } else {
                        task.So_id = SO_id;
                        task.notificationNewSo = true;
                        task.date_planned = task.date_planned;
                        task.time = task.date_planned + ' ' + task.time;

                        if (typeof task.photoSO !== 'undefined' && task.photoSO.length > 0) {
                            for (let i = 0; i < task.photoSO.length; i++) {
                                if (task.photoSO[i]) {
                                    if (knownTypes[task.photoSO[i][0]]) {
                                        task.photoSO[i] =
                                            knownTypes[task.photoSO[i][0]] + task.photoSO[i];
                                    }
                                }
                            }
                        }
                        obtainSo_origin(SO_id);
                    }
                }
            );
        };

        let createService = function () {
            //count = 0;

            let SO = {
                company_id: 1,
                order_line: [
                    [
                        0,
                        0,
                        {
                            name: task.type,
                            price_unit: 0.0,
                            product_id: task.product_id,
                            product_uom: 1,
                            product_uom_qty: 1.0,
                            state: 'draft',
                        },
                    ],
                ],
                note: task.description,
                partner_id: task.client_id,
                title: task.title,
                commitment_date: task.date_planned + ' ' + task.time,
                require_materials: task.require_materials,
                require_payment: false,
                require_signature: false,
                state: 'draft',
                anonimus: task.anonimus,
                anonimus_author: task.anonimus_author,
                address_street: task.address.street,
                address_floor: task.address.floor,
                address_portal: task.address.portal,
                address_number: task.address.number,
                address_door: task.address.door,
                address_stairs: task.address.stair,
                address_zip_code: task.address.cp,
                address_latitude: task.address.latitude,
                address_longitude: task.address.longitude,
            };
            let inParams = [];
            inParams.push(SO);
            let params = [];
            params.push(inParams);
            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('sale.order'); //model
            fparams.push('create'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, ' Error createService');
                        notificationError$.next({ type: 8 });
                    } else {
                        //console.log(value, 'createService')

                        // if (task.photoSO.length) {
                        //     count = task.photoSO.length - 1;
                        //     create_SO_attachment(value);
                        // } else {
                        confirmService(value);
                        //}
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            function (err, error, value) {
                if (err || !value) {
                    //notificationError$.next(true);
                    console.log(err, 'newTask');
                    notificationError$.next({ type: 0 });
                } else {
                    createService();
                }
            }
        );
    }

    getProvidersInfoOfferAnonimus(provider_id: any[], SO_id: number) {
        let coment: Comments;

        let list_msg_ids = () => {
            let inParams = [];
            inParams.push([
                ['notified_partner_ids', 'in', provider_id],
                ['message_type', '=', 'ranking'],
            ]);
            inParams.push(['notified_partner_ids', 'body', 'ranking', 'author_id']);
            let params = [];
            params.push(inParams);

            params.push({ offset: 0, limit: 2 });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('mail.message'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        notificationError$.next({ type: 5 });
                        //console.log(err,"list_msg_ids comments")
                    } else {
                        //console.log(value, 'message del provider with comment');

                        if (value !== 'undefined' && value.length > 0) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === SO_id
                            );
                            if (temp !== -1) {
                                for (let resId of value) {
                                    let temp1 = applicationList[temp].So_offers.findIndex(
                                        (element) =>
                                            element.provider_id ===
                                            resId.notified_partner_ids[
                                                resId.notified_partner_ids.length - 1
                                            ]
                                    );
                                    if (temp1 !== -1) {
                                        coment = {
                                            author: resId.author_id[1],
                                            comment: resId.body.slice(3, resId.body.length - 4),
                                            ranking: resId.ranking,
                                        };

                                        // console.log("entro",coment);
                                        applicationList[temp].So_offers[
                                            temp1
                                        ].opinions_provider.push(coment);
                                    }
                                }
                            }
                        }
                        // console.log(applicationList[countTest].So_offers,"ofertas Comentarios")
                        task$.next({ type: 5 });
                    }
                }
            );
        };

        let search_avatar_provider = () => {
            let inParams = [];

            inParams.push([['partner_id', 'in', provider_id]]);
            inParams.push(['partner_id', 'image_1920', 'ranking']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //console.log(err, 'Error search_avatar_provider');
                        notificationError$.next({ type: 5 });
                    } else {
                        ////console.log(value, "avatar");

                        if (value) {
                            let temp = applicationList.findIndex(
                                (element) => element.So_id === SO_id
                            );
                            if (temp !== -1) {
                                for (let resId of value) {
                                    for (let offer of applicationList[temp].So_offers) {
                                        if (offer.provider_id === resId.partner_id[0]) {
                                            if (knownTypes[resId.image_1920[0]]) {
                                                offer.photoProvider =
                                                    knownTypes[resId.image_1920[0]] +
                                                    resId.image_1920;
                                                offer.provider_name = resId.partner_id[1];
                                                offer.ranking_provider = resId.ranking;
                                                //tempInfo.push(offer);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //!!info de los providers
                        list_msg_ids();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    //console.log(err, 'requestTaskListClient')
                } else {
                    search_avatar_provider();
                }
            }
        );
    }

    requestPromotionsList() {
        offsetPromo = 0;
        promoList = [];

        let get_po_list_promotion = () => {
            let inParams = [];
            inParams.push([['partner_id', '=', 7]]);
            inParams.push([
                // 'state',
                'user_id',
                'product_id',
                // 'invoice_status',
                'partner_id',
                // 'date_order',
                'name',
                'note',
                // //'client_order_ref',
                'title',
                // 'require_materials',
                // 'commitment_date',
                // 'address_street',
                // 'address_floor',
                // 'address_portal',
                // 'address_number',
                // 'address_door',
                // 'address_stairs',
                // 'address_zip_code',
                // 'address_latitude',
                // 'address_longitude',
                'order_line',
                // 'distance',
                'origin',
                // 'new_created',
                // 'new_chat',
                //'po_agreement',
            ]);

            let params = [];

            params.push(inParams);
            params.push({ offset: offsetPromo, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push('6');
            fparams.push('demo');

            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 16 });
                    } else {
                        //console.log(value,"get_po_list_promotion");

                        offsetPromo += limit;

                        for (let order of value) {
                            let temp = new TaskModel();

                            temp.So_origin = order['origin'];
                            //temp.Po_state = order['state']
                            temp.type = order['product_id'][1];
                            temp.description = order['note'];
                            temp.client_id = order['user_id'][0];
                            temp.client_name = order['user_id'][1];
                            //   temp.provider_id = order['partner_id'][0]
                            //   temp.provider_name = order['partner_id'][1]
                            //   temp.require_materials = order['require_materials']
                            //   temp.Po_id = order['id']
                            //   temp.Po_invoice_status = order['invoice_status']
                            //temp.Po_name = order['name']
                            //temp.date_created = order['date_order']
                            //temp.date_planned = String(order['commitment_date']).slice(0, 10)
                            // temp.time = String(order['commitment_date'])
                            temp.title = order['title'];
                            //temp.notificationNewSo = order['new_created']
                            //temp.notificationNewChat = order['new_chat']
                            //   temp.address = new Address(
                            //     order['address_street'],
                            //     order['address_number'],
                            //     order['address_portal'],
                            //     order['address_stairs'],
                            //     order['address_floor'],
                            //     order['address_door'],
                            //     order['address_zip_code'],
                            //     order['address_latitude'],
                            //     order['address_longitude'],
                            //     order['distance'],
                            //   )
                            temp.Po_order_line = order['order_line'];
                            promoList.push(temp);
                        }

                        if (promoList && promoList.length) {
                            console.log(promoList, 'lista de promociones');
                            task$.next({ type: 1 });
                        } else {
                            //!Actualizar observable

                            task$.next({ type: 0 });
                        }
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, 'demo', 'demo'],
            },
            function (err, error, value) {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    //////console.log(err, 'requestTaskListClient');
                } else {
                    get_po_list_promotion();
                }
            }
        );
    }

    createComplaintClient(Task: TaskModel) {
        let count: number;

        let create_Complaint_attachment = function () {
            let attachement = {
                name: 'photoComplaint_' + count + '.jpg',
                datas: Task.complaint_Photo[count],
                type: 'binary',
                description: 'photoComplaint_' + count.toString + '.jpg',
                res_model: 'sale.order',
                res_id: Task.So_id,
            };
            let inParams = [];
            inParams.push(attachement);

            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('ir.attachment'); //model
            fparams.push('create'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error create_SO_attachment');
                        //cancelSOclientSelected(SO_id);
                        notificationError$.next({ type: 8 });
                    } else {
                        count--;
                        if (count >= 0) {
                            create_Complaint_attachment();
                        } else {
                            console.log('Denuncia hecha correctamente');
                        }
                    }
                }
            );
        };

        let client_create_complaint = () => {
            let inParams = [];
            inParams.push([Task.facturation_id]);
            inParams.push([
                //'po_agreement',
            ]);

            let params = [];
            params.push(inParams);
            //params.push({ offset: offsetPromo, limit: limit });

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);

            fparams.push('purchase.order'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        //////console.log(err, 'get_so_list');
                        notificationError$.next({ type: 16 });
                    } else {
                        //console.log(value,"get_po_list_promotion");

                        create_Complaint_attachment();
                    }
                }
            );
        };

        let client = jayson.https({
            host: jaysonServer.host,
            port: jaysonServer.port + jaysonServer.pathConnection,
        });
        client.request(
            'call',
            {
                service: 'common',
                method: 'login',
                args: [jaysonServer.db, jaysonServer.username, jaysonServer.password],
            },
            (err, error, value) => {
                if (err || !value) {
                    notificationError$.next({ type: 0 });
                    ////console.log(err, 'requestTaskListClient');
                } else {
                    client_create_complaint();
                }
            }
        );
    }
}
