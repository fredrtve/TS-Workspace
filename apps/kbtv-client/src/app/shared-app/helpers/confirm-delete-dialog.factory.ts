export function _confirmDeleteDialogFactory(itemWord: string, deleteCallback: () => void){
    return {
        title: 'Bekreft sletting', 
        message: `Er du sikker på at du vil slette ${itemWord}?`,
        confirmText: 'Slett',
        confirmCallback: deleteCallback
      }
}