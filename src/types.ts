export interface User {
  userid: number;
  username: string;
  create_date: string;
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
  permissions?: Permission[];
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
  poller?: Poller;
}

export interface Poller {
  pollerid: number;
  name: string;
  description: string;
  api_key: string;
  hostname: string;
  port: number;
}

export interface GroupedDeviceChecks {
  groups: {[key: number]: {
    device_check_groupid: number;
    name: string;
    description: string;
    checks: DeviceCheck[];
  }};  
  checks: DeviceCheck[];
}

export interface DeviceCheck {
  device_checkid: number;
  deviceid: number;  
  device_check_groupid: number;
  name: string;
  description: string;  
  check_interval: number;
  check_type: string;
  oid: string;
}
