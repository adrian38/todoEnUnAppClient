import { MessageModel } from 'src/app/models/message.model';
import { Comments } from '../interfaces/interfaces';

export class Address {
    street: string;
    number: string;
    portal: string;
    stair: string;
    floor: string;
    door: string;
    cp: string;
    latitude: string;
    longitude: string;
    distance: number;

    constructor(
        street: '',
        number: '',
        portal: '',
        stair: '',
        floor: '',
        door: '',
        cp: '',
        latitude: '',
        longitude: '',
        distance: 0
    ) {
        this.street = street;
        this.number = number;
        this.portal = portal;
        this.stair = stair;
        this.floor = floor;
        this.door = door;
        this.cp = cp;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distance = distance;
    }
}

export class TaskModel {
    type?: string;
    client_id?: number;
    client_name?: string;
    So_id?: number;
    So_origin?: string;
    So_state?: string;
    So_budget?: number;
    So_offers?: TaskModel[];
    photoClient?: any;
    photoSO?: Array<any>;
    date_planned?: string;
    date_created?: string;
    time?: string;
    title?: string;
    description?: string;
    address?: Address;
    messageList?: MessageModel[];
    require_materials?: boolean;
    product_id?: number;
    Po_order_line?: Array<any>;
    materials?: number;
    work_force?: number;
    materials_extra?: number;
    work_force_extra?: number;
    Po_state?: string;
    Po_offer_send?: string;
    Po_name?: string;
    Po_id?: number;
    provider_id?: number;
    provider_name?: number;
    photoProvider?: any;
    opinions_provider?: Comments[];
    ranking_provider?: number;
    notificationNewOffert?: boolean;
    notificationNewChat?: boolean;
    notificationNewSo?: boolean;
    notificationNewDate?: boolean;
    notificationExtraCost?: boolean;
    notificationDemand?: boolean;
    notificationType?: number;
    complaint?: boolean;
    downloadPhotoSo?: boolean;
    Up_coming_Offer?: number[];
    Up_coming_Chat?: any[];
    facturation_line?: any[];
    facturation_name?: string;
    facturation_id?: number;
    Po_id_new_budget?: any[];
    finish?: boolean;
    Po_invoice_status?: string;
    cash?: boolean;
    budget?: number;
    legal_status?: boolean; //false when no lawsuit; true if lawsuit exists
    legal_status_solved?: number; //states of solving legal status  1: denunciado   2: ganado  3: perdido
    anonimus_author: string;
    anonimus: boolean;
    complaint_Photo?: any[];

    constructor(
        type: string = '',
        require_materials = false,
        product_id = 0,
        Po_order_line = [],
        materials = 0,
        work_force = 0,
        materials_extra = 0,
        work_force_extra = 0,
        Po_state = '',
        Po_offer_send = '',
        //Po_origin = "",
        Po_name = '',
        Po_id = 0,
        provider_id = 0,
        provider_name = 0,
        photoProvider = '',
        opinions_provider = [],
        ranking_provider = 0,
        notificationNewOffert = false,
        notificationNewChat = false,
        notificationNewSo = false,
        notificationNewDate = false,
        notificationExtraCost = false,
        notificationDemand = false,
        notificationType = 0,
        downloadPhotoSo = false,
        complaint = false,
        client_id = 0,
        client_name = '',
        So_id = 0,
        So_origin = '',
        So_state = '',
        So_budget = 0,
        photoClient = '',
        photoSO = [],
        date_planned = '',
        date_created = '',
        time = '',
        title = '',
        description = '',
        So_offers = [],
        messageList = [],
        Up_coming_Offer = [],
        Up_coming_Chat = [],
        facturation_line = [],
        facturation_name = '',
        facturation_id = 0,
        Po_id_new_budget = [],
        finish = false,
        Po_invoice_status = '',
        cash = false,
        budget = 0,
        anonimus_author = '',
        anonimus = false,
        complaint_Photo = []
    ) {
        this.type = type;
        this.client_id = client_id;
        this.client_name = client_name;
        this.So_id = So_id;
        this.So_origin = So_origin;
        this.So_state = So_state;
        this.So_budget = So_budget;
        this.photoClient = photoClient;
        this.photoSO = photoSO;
        this.date_planned = date_planned;
        this.date_created = date_created;
        this.time = time;
        this.title = title;
        this.description = description;
        this.So_offers = So_offers;

        this.require_materials = require_materials;
        this.product_id = product_id;
        this.Po_order_line = Po_order_line;
        this.materials = materials;
        this.work_force = work_force;
        this.materials_extra = materials_extra;
        this.work_force_extra = work_force_extra;
        this.Po_state = Po_state;
        this.Po_offer_send = Po_offer_send;
        this.Po_name = Po_name;
        this.Po_id = Po_id;
        this.provider_id = provider_id;
        this.provider_name = provider_name;
        this.photoProvider = photoProvider;
        this.opinions_provider = opinions_provider;
        this.ranking_provider = ranking_provider;
        this.notificationNewOffert = notificationNewOffert;
        this.notificationNewChat = notificationNewChat;
        this.notificationNewSo = notificationNewSo;
        this.notificationNewDate = notificationNewDate;
        this.notificationExtraCost = notificationExtraCost;
        this.notificationDemand = notificationDemand;

        this.complaint = complaint;
        this.complaint_Photo = complaint_Photo;
        this.messageList = messageList;
        this.downloadPhotoSo = downloadPhotoSo;
        this.Up_coming_Chat = Up_coming_Chat;
        this.Up_coming_Offer = Up_coming_Offer;
        this.facturation_line = facturation_line;
        this.facturation_name = facturation_name;
        this.facturation_id = facturation_id;

        this.Po_id_new_budget = Po_id_new_budget;
        this.notificationType = notificationType;
        this.finish = finish;
        this.Po_invoice_status = Po_invoice_status;
        this.cash = cash;
        this.budget = budget;

        this.anonimus = anonimus;
        this.anonimus_author = anonimus_author;
    }
}
