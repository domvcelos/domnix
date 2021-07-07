export interface INixCoreUserPayload {
    cadun_id: string;
    name: string;
    cpf: string;
    password: string;
    email: string;
    phone: string;
    birthday: string;
    mother_name: string;
    social_name: string;
    phone_country_code: string;
    address_number: string;
    address_neighborhood: string;
    address_complement: string;
    address_country: string;
    address_line: string;
    address_city: string;
    address_state: string;
    address_zip_code: string;
}

export interface ICadunUserPayload {
    name: string;
    username: string;
    password: string;
    email: string;
    social_number: string;
    phone: string;
    birthday: string;
    optional_attributes: any;
}
