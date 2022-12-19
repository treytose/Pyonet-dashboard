export interface User {
  userid: number;
  username: string;
  roles?: Role[];
}

export interface Permission {
  permissionid: number;
  name: string;
  description: string;
}

export interface Role {
  roleid: number;
  name: string;
  description: string;
}

export interface Device {
  deviceid: number;
  name: string;
  hostname: string;
  description: string;
  snmp_version: string;
  snmp_community: string;
  snmp_port: number;
  pollerid: number;
  poller?: any;
}

export interface Poller {
  pollerid: number;
  name: string;
  description: string;
  api_key: string;
}
