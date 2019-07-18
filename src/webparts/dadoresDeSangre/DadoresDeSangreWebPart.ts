import { Version } from '@microsoft/sp-core-library';
import {
	BaseClientSideWebPart,
	IPropertyPaneConfiguration,
	PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DadoresDeSangreWebPart.module.scss';
import * as strings from 'DadoresDeSangreWebPartStrings';
import MockHttpClient from './MockHttpClient';
import {
	SPHttpClient,
	SPHttpClientResponse
} from '@microsoft/sp-http';
import {
	Environment,
	EnvironmentType
} from '@microsoft/sp-core-library';

export interface IDadoresDeSangreWebPartProps {
	description: string;
	nombreLista: string;
	verTodosLink: string;
}

export interface ISPLists {
	value: ISPList[];
}

export interface ISPList {
	Id: string;
	Title: string;
	Paciente: string;
	GrupoYFactor: string;
	CantidadDonantes: number;
	FileRef: string;
}

export default class DadoresDeSangreWebPart extends BaseClientSideWebPart<IDadoresDeSangreWebPartProps> {

	private _renderListAsync(): void {
		if (Environment.type === EnvironmentType.Local) {
			this._getMockListData().then((response) => {
				this._renderList(response.value);
			});
		} else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
			this._getListData().then((response) => {
				this._renderList(response.value);
			});
		}
	}

	private _getMockListData(): Promise<ISPLists> {
		return MockHttpClient.get()
			.then((data: ISPList[]) => {
				var listData: ISPLists = { value: data };
				return listData;
			}) as Promise<ISPLists>;
	}

	private _getListData(): Promise<ISPLists> {
		return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${this.properties.nombreLista}')/Items?$select=*,FileRef&$top=3&$orderby=Created desc`, SPHttpClient.configurations.v1)
			.then((response: SPHttpClientResponse) => {
				return response.json();
			});
	}

	private _renderList(items: ISPList[]): void {
		let html: string = '';
		items.forEach((item: ISPList) => {
			html += `
				<div class="${ styles.listItem}">
					<a class="${ styles.card}" title="Más Información" href="${item.FileRef.substring(0, item.FileRef.lastIndexOf('/'))}/Dispform.aspx?ID=${item.Id}">
						<div class="ms-textAlignCenter ${ styles.cardTitle}">${item.Paciente.toLowerCase()}</div>

						<div class="${ styles.cardFactor}">
							<i class="ms-Icon ms-Icon--Health ms-font-xxl" aria-hidden="true"></i>
							<div>${ item.GrupoYFactor}</div>
						</div>
						
					</a>
				</div>`;
		});

		const listContainer: Element = this.domElement.querySelector('#spListContainer');
		listContainer.innerHTML = `<div class="ms-Grid-row">${html}</div>`;
	}


	public render(): void {
		this.domElement.innerHTML = `
			<div class="${ styles.dadoresDeSangre}">
				<div class="ms-Grid-row" style="margin:5px">
					<div class="ms-Grid-col ms-sm6 ms-md8 ms-lg10 ${styles.description} ">${escape(this.properties.description)}</div>
					<div class="ms-Grid-col ms-sm6 ms-md4 ms-lg2 ms-textAlignRight">
						<a class="${ styles.button }" href="${ escape(this.properties.verTodosLink) }">
							<span class="${ styles.label }">Ver todo</span>
						</a>
					</div>
				</div>
				<hr style="border: 1px solid white;box-shadow: 0px 3px 8px 0px rgba(0,0,0,0.5);" />
				<div id="spListContainer" class="ms-Grid" dir="ltr" />
			</div>
		`;
		this._renderListAsync();
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel
								}),
								PropertyPaneTextField('nombreLista', {
									label: strings.ListaFieldLabel
								}),
								PropertyPaneTextField('verTodosLink', {
									label: strings.VinculoFieldLabel
								}),
							]
						}
					]
				}
			]
		};
	}
}
