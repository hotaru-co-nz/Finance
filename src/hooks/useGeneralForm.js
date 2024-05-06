import {useAppData} from "../App";

export default function useGeneralForm() {
    const app = useAppData();

    const openForm = (title, description, entries, onSubmit, formEntity) => {
        app._generalFormConfig({title, description, entries,onSubmit});
        app._generalFormEntity(formEntity)
        app.onGeneralFormOpen(true);
    };

    const closeForm = (clearData = false) => {
        if (clearData) {
            app._generalFormConfig({title: "", entries: []});
            app._onGeneralFormValidate(() => {
            });
            app._onGeneralFormSubmit(() => {
            });
            app._generalFormEntity(undefined)
        }
        app.onGeneralFormOpen(false);
    };

    return {
        open: openForm,
        close: closeForm,
    };
}
