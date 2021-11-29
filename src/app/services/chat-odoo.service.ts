import { Injectable } from '@angular/core';
import { MessageModel } from '../models/message.model';
import { UsuarioModel } from '../models/usuario.model'
import { Observable, Subject } from 'rxjs';
import { AuthOdooService } from '../services/auth-odoo.service';
let jayson = require('../../../node_modules/jayson/lib/client/');

let jaysonServer;

let user: UsuarioModel

let messagesList: MessageModel[];
// let messagesList$ = new Subject<MessageModel[]>();
// let messageSendOk$ = new Subject<MessageModel>();
// let messageOriginNotification$ = new Subject<MessageModel[]>();

let message$ = new Subject<any>()
let notificationError$ = new Subject<any>();


@Injectable({
    providedIn: 'root'
})
export class ChatOdooService {


    constructor(private _authOdoo: AuthOdooService) { }

    setUserAnonimus(usuario: UsuarioModel, Jayson ) {
        user = usuario;
        jaysonServer = Jayson;
    }

    getMessages$(): Observable<any> {
        return message$.asObservable();
    }

    getNotificationError$(): Observable<any> {
        return notificationError$.asObservable();
    }

    setUser(usuario: UsuarioModel) {
        user = usuario;
        jaysonServer = this._authOdoo.OdooInfoJayson;
    }

    setNewPassword(password: string) {
        jaysonServer.password = password;
        user.password = password;
    }

    sendMessageClient(message: MessageModel) {

        let send_msg_PO = function () {
            let inParams = []
            inParams.push([message.offer_id])
            let params = []
            params.push(inParams)
            params.push({ 'body': message.message, 'message_type': 'notification', 'subtype': 'false' })

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('message_post');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    //console.log(err, "Error send_msg_PO");
                    notificationError$.next({ type: 6 });
                } else {
                    message$.next({ type: 0, messages: message });
                }
            })
        }

        let client = jayson.https({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {
            if (err || !value) {
                // console.log(err, "Error sendMessageClient");
                notificationError$.next({ type: 0 });
            } else {
                send_msg_PO();
            }
        });

    }

    requestNewMessage(idNewMessage: number[]) {

        let NewMessage = function () {

            let inParams = []
            inParams.push([idNewMessage])
            inParams.push([['id', 'in', idNewMessage]])
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id'])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_messages');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    //console.log(err, "Error NewMessage");
                    notificationError$.next({ type: 10 });
                } else {

                    value = value.filter(messages => {
                        return messages.subtype_id === false;
                    });
                    value.reverse();
                    messagesList = [];
                    for (let message of value) {

                        let temp: MessageModel =
                            new MessageModel(message['body'].slice(3, message['body'].length - 4),
                                message['author_id'][1],
                                message['author_id'][0],
                                message['res_id']);
                        messagesList.push(temp);
                    }

                    //console.log("devolviendo mensaje", messagesList);

                    message$.next({ type: 1, messages: messagesList });
                    // messagesList$.next(messagesList);

                }
            });

        }

        let client = jayson.https({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                //console.log(err, "Error requestAllMessages ");
                notificationError$.next({ type: 0 });
            } else {
                //console.log(value);
                NewMessage();
            }
        });
    }

    requestNewMessageNoti(idNewMessage: number[]) {

        let messagesList: MessageModel[] = [];
        let Po: number[] = [];

        let get_po_of_task = function (id: number[]) {
            let inParams = [];
            inParams.push([['id', 'in', id]]);
            inParams.push(['origin', 'state']);

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

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (
                err,
                error,
                value
            ) {
                if (err || !value) {
                    console.log(err, 'Error requestOffersForTask');
                } else {



                    for (let offer of value) {
                        for (let msg of messagesList) {
                            if (offer['id'] === msg.offer_id) {
                                msg.offer_origin = offer['origin'];

                            }
                        }
                    }

                    // messageOriginNotification$.next(messagesList);

                }


            });
        };


        let NewMessage = function () {
            let inParams = []
            inParams.push([idNewMessage])
            inParams.push([['id', 'in', idNewMessage]])
            inParams.push(['res_id', 'subtype_id', 'id'])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_messages');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error NewMessage");
                } else {
                    value = value.filter(messages => {
                        return messages.subtype_id === false;
                    });


                    for (let message of value) {

                        let temp: MessageModel = new MessageModel("", "", 0, message['res_id'], "", "", message['id']);
                        messagesList.push(temp);
                        Po.push(message['res_id'])
                    }

                    get_po_of_task(Po);

                }
            });

        }

        let client = jayson.https({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error requestAllMessages ");
            } else {

                NewMessage();
            }
        });

    }

    requestAllMessages(idPurchaseOrder: number) {
        let list_msg_ids = function () {
            const id_po = idPurchaseOrder
            let inParams = []
            inParams.push([id_po])
            inParams.push([['res_id', '=', id_po]])
            inParams.push(['res_id', 'body', 'author_id', 'subtype_id'])
            let params = []
            params.push(inParams)

            let fparams = [];
            fparams.push(jaysonServer.db);
            fparams.push(user.id);
            fparams.push(jaysonServer.password);
            fparams.push('purchase.order');//model
            fparams.push('search_messages');//method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request('call', { service: 'object', method: 'execute_kw', args: fparams }, function (err, error, value) {

                if (err || !value) {
                    console.log(err, "Error list_msg_ids");
                } else {

                    value = value.filter(messages => {
                        return messages.subtype_id === false;
                    });
                    value.reverse();
                    messagesList = [];
                    for (let message of value) {

                        let temp: MessageModel =
                            new MessageModel(message['body'].slice(3, message['body'].length - 4),
                                message['author_id'][1],
                                message['author_id'][0],
                                message['res_id']);
                        messagesList.push(temp);
                    }
                    // messagesList$.next(messagesList);
                    //console.log(messagesList);
                }
            })
        }

        let client = jayson.https({ host: jaysonServer.host, port: jaysonServer.port + jaysonServer.pathConnection });
        client.request('call', { service: 'common', method: 'login', args: [jaysonServer.db, jaysonServer.username, jaysonServer.password] }, function (err, error, value) {

            if (err || !value) {
                console.log(err, "Error requestAllMessages ");
            } else {
                console.log(value);
                list_msg_ids()
            }
        });
    }























}