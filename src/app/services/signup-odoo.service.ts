import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { Observable, Subject } from 'rxjs';
let jayson = require('../../../node_modules/jayson/lib/client/');

//let host = '192.168.0.107';
//let host = '127.0.0.1';
//let host: '192.168.42.25'

let host = 'odoo.todoenunapp.com';
let port = 443;
//let port = 8069;
let db = 'demo';
let user = 'root';
let pass = 'root';

let notificationError$ = new Subject<boolean>();
let notificationOK$ = new Subject<boolean>();

@Injectable({
    providedIn: 'root',
})
export class SignUpOdooService {
    constructor() {}

    getNotificationError$(): Observable<boolean> {
        return notificationError$.asObservable();
    }

    getNotificationOK$(): Observable<boolean> {
        return notificationOK$.asObservable();
    }

    newUser(usuario: UsuarioModel) {
        console.log(usuario, 'sigupClient');

        let user_to_create;
        let partner_update;

        if (usuario.type === 'client') {
            user_to_create = {
                name: usuario.realname,
                classification: 'customer', // puede ser 'custumer','vendor' o 'admin'
                login: usuario.username,
                email: usuario.username,
                password: usuario.password,
                image_1920: usuario.avatar,
                groups_id: [22, 1, 11, 17, 34, 23, 6, 35, 20, 19],
                /* groups_id son los mismos para custumer y vendor para admin son: [2,21,36,22,26,7,1,11,17,34,3,23,6,35,20,19]*/
            };

            partner_update = {
                date: usuario.date, //birthdate
                address_street: usuario.address.street,
                address_floor: usuario.address.floor,
                address_portal: usuario.address.portal,
                address_number: usuario.address.number,
                address_door: usuario.address.door,
                address_stairs: usuario.address.stair,
                address_zip_code: usuario.address.cp,
                address_latitude: usuario.address.latitude,
                address_longitude: usuario.address.longitude,
                mobile: usuario.phone,
            };
        }

        let set_partner_update = function () {
            console.log(usuario.partner_id);

            let inParams = [];
            inParams.push([usuario.partner_id]); //id to update
            inParams.push(partner_update);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(db);
            fparams.push(1);
            fparams.push(pass);
            fparams.push('res.partner'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        console.log(err, 'Error actualizando campos usuario');
                        notificationError$.next(true);
                    } else {
                        console.log('actualizando campos usuario exito');
                        notificationOK$.next(true);
                    }
                }
            );
        };

        let get_user = function (id: number) {
            let inParams = [];
            inParams.push([['id', '=', id]]);
            inParams.push(['partner_id']);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(db);
            fparams.push(id);
            fparams.push(usuario.password);
            fparams.push('res.users'); //model
            fparams.push('search_read'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        console.log(err, 'Error get_user');
                        notificationError$.next(true);
                    } else {
                        usuario.partner_id = value[0].partner_id[0];
                        set_partner_update();
                    }
                }
            );
        };

        let path = '/jsonrpc';
        let client = jayson.https('https://' + host + ':' + port + path);

        let inParams = [];
        inParams.push(user_to_create);
        let params = [];
        params.push(inParams);

        let fparams = [];
        fparams.push(db);
        fparams.push(1);
        fparams.push(pass);
        fparams.push('res.users'); //model
        fparams.push('create'); //method

        for (let i = 0; i < params.length; i++) {
            fparams.push(params[i]);
        }

        client.request(
            'call',
            { service: 'object', method: 'execute_kw', args: fparams },
            function (err, error, value) {
                if (err || !value) {
                    console.log(err, 'Error creando usuario o el usuario ya existe');
                    notificationError$.next(true);
                } else {
                    console.log(value, 'Exito creando el usuario');
                    get_user(value);
                }
            }
        );
    }

    updateUser(tempUser: UsuarioModel) {
        // console.log(tempUser, 'servicio ');
        // console.log(tempUser.avatar, 'servicio avatar');

        let user_to_update = {
            image_1920: tempUser.avatar,
        };

        let partner_update = {
            address_street: tempUser.address.street,
            address_floor: tempUser.address.floor,
            address_portal: tempUser.address.portal,
            address_number: tempUser.address.number,
            address_door: tempUser.address.door,
            address_stairs: tempUser.address.stair,
            address_zip_code: tempUser.address.cp,
            address_latitude: tempUser.address.latitude,
            address_longitude: tempUser.address.longitude,
        };

        // console.log(partner_update, 'info a actualizar');
        // console.log(user_to_update, 'photo a actualizar');

        let updatePatner = function () {
            /* let path = '/jsonrpc';
      let client = jayson.https('https://' + host + ':' + port + path); */

            let inParams = [];
            inParams.push(tempUser.partner_id);
            inParams.push(partner_update);
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(db);
            fparams.push(1);
            fparams.push(pass);
            fparams.push('res.partner'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err) {
                        console.log(err, 'Error update partner');
                        notificationError$.next(true);
                    } else {
                        console.log('Exito update partner');
                        notificationOK$.next(true);
                    }
                }
            );
        };
        let path = '/jsonrpc';
        let client = jayson.https('https://' + host + ':' + port + path);

        let inParams = [];
        inParams.push(tempUser.id);
        inParams.push(user_to_update);
        let params = [];
        params.push(inParams);

        let fparams = [];
        fparams.push(db);
        fparams.push(1);
        fparams.push(pass);
        fparams.push('res.users'); //model
        fparams.push('write'); //method

        for (let i = 0; i < params.length; i++) {
            fparams.push(params[i]);
        }

        client.request(
            'call',
            { service: 'object', method: 'execute_kw', args: fparams },
            function (err, error, value) {
                if (err || !value) {
                    //console.log(err, 'Error actualizando usuario o el usuario ya existe');
                    notificationError$.next(true);
                } else {
                    //console.log(value, 'Exito actualizando el usuario');
                    updatePatner();
                }
            }
        );
    }

    updateUserPassword(usuario: UsuarioModel) {
        let path = '/jsonrpc';
        let client = jayson.https('https://' + host + ':' + port + path);

        let updatePassword = function () {
            let inParams = [];
            inParams.push(usuario.id);
            inParams.push({ password: usuario.password });
            let params = [];
            params.push(inParams);

            let fparams = [];
            fparams.push(db);
            fparams.push(1);
            fparams.push(pass);
            fparams.push('res.users'); //model
            fparams.push('write'); //method

            for (let i = 0; i < params.length; i++) {
                fparams.push(params[i]);
            }

            client.request(
                'call',
                { service: 'object', method: 'execute_kw', args: fparams },
                function (err, error, value) {
                    if (err || !value) {
                        //console.log(err, 'Error actualizando usuario o el usuario ya existe');
                        notificationError$.next(true);
                    } else {
                        notificationOK$.next(true);
                        //console.log(value, 'Exito actualizando el usuario');
                    }
                }
            );
        };

        console.log(usuario.name, 'nombre del usuario');

        let inParams = [];
        inParams.push([['email', '=', usuario.name]]);
        inParams.push(['id']);
        let params = [];
        params.push(inParams);

        let fparams = [];
        fparams.push(db);
        fparams.push(1);
        fparams.push('root');
        fparams.push('res.users'); //model
        fparams.push('search_read'); //method

        for (let i = 0; i < params.length; i++) {
            fparams.push(params[i]);
        }

        client.request(
            'call',
            { service: 'object', method: 'execute_kw', args: fparams },
            (err, error, value) => {
                if (err || !value) {
                    //console.log(err, 'Error actualizando usuario o el usuario ya existe');
                    notificationError$.next(true);
                } else {
                    usuario.id = value[0]['id'];

                    updatePassword();
                    //notificationOK$.next(true);
                    //console.log(value, 'usuario encontrado');
                }
            }
        );
    }

    updateUserPasswordInside(usuario: UsuarioModel) {
        let path = '/jsonrpc';
        let client = jayson.https('https://' + host + ':' + port + path);

        let inParams = [];
        inParams.push(usuario.id);
        inParams.push({ password: usuario.password });
        let params = [];
        params.push(inParams);

        let fparams = [];
        fparams.push(db);
        fparams.push(1);
        fparams.push(pass);
        fparams.push('res.users'); //model
        fparams.push('write'); //method

        for (let i = 0; i < params.length; i++) {
            fparams.push(params[i]);
        }

        client.request(
            'call',
            { service: 'object', method: 'execute_kw', args: fparams },
            function (err, error, value) {
                if (err || !value) {
                    //console.log(err, 'Error actualizando usuario o el usuario ya existe');
                    notificationError$.next(true);
                } else {
                    notificationOK$.next(true);
                    //console.log(value, 'Exito actualizando el usuario');
                }
            }
        );
    }
}
