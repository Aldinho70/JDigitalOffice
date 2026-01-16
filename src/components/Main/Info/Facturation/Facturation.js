import { UI } from "../../../sharedComponents/sharedComponents.js"

export const viewFacturation = ( id ) =>{
    UI.Modal( 'root_modal_facturation', {title: 'Detalles de facturacion'} );
    
}
window.viewFacturation = viewFacturation;