export interface SubscriptionsModel {
  nagvis?: {
    host: string[];
    service: string[];
  };
}

export namespace SubscriptionsModel {
  export const NAGVIS = ['host', 'service', 'hostgroup', 'servicegroup'];
}