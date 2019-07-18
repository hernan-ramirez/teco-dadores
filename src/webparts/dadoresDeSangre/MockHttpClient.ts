import { ISPList } from './DadoresDeSangreWebPart';

export default class MockHttpClient {

    private static _items: ISPList[] = [
        {
            Id: '1',
            Title: 'Mock Title Uno',
            Paciente: "Paciente Uno",
            GrupoYFactor: "0+",
            CantidadDonantes: 16,
            FileRef: "/sites/DesarrollosHRamirez/TelecomPersonal/Dadores/Lists/DadoresSangre/1_.000"
        },
        {
            Id: '2',
            Title: 'MOCK TITLE DOS',
            Paciente: 'PACIENTE DOS CAPS',
            GrupoYFactor: "Cualquier grupo",
            CantidadDonantes: 25,
            FileRef: "/sites/DesarrollosHRamirez/TelecomPersonal/Dadores/Lists/DadoresSangre/2_.000"
        },
        {
            Id: '3',
            Title: 'Mock Title Tres',
            Paciente: 'Paiente Tres',
            GrupoYFactor: "A-",
            CantidadDonantes: 10,
            FileRef: "/sites/DesarrollosHRamirez/TelecomPersonal/Dadores/Lists/DadoresSangre/3_.000"
        }
    ];

    public static get(): Promise<ISPList[]> {
        return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}