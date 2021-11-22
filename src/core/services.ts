/* eslint-disable quotes */
export interface Service {
  id: string;
  title: string;
  descr: string;
  color: string;
  url: string;
}

export const defServices: Service[] = [
  {
    id: '@kremen/transport-web',
    title: '#Кремінь.Транспорт',
    descr: 'Карта руху громадського транспорту',
    url: 'https://transport.kremen.dev',
    color: '#3273dc',
  },
  {
    id: '@kremen/deputies-web',
    title: '#Кремінь.Депутат',
    descr: "Карта виборчих округів дозволяє вам дізнатись хто є депутатом вашого району та як з ним зв'язатись",
    url: 'https://deputat.kremen.dev',
    color: '#ECB400',
  },
  {
    id: '@kremen/equipment-web',
    title: '#Кремінь.Техніка',
    descr: 'Карта руху комунальної техніки, снігоприбиральників, посипальників та тракторів',
    url: 'https://equipment.kremen.dev',
    color: '#E0535D',
  },
];

export const serviceIdToTitle = (id: string) => {
  const itm = defServices.find(itm => itm.id === id);
  return itm ? itm.title : '#Kremen.Dev';
};
