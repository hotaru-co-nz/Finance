export default function useGeneralForm() {
    // const app = useAppData();

    const openForm = (title, description, entries, onSubmit, formEntity) => {
        // app._generalFormConfig({ title, description, entries, onSubmit });
        // app._generalFormEntity(formEntity);
        // app.onGeneralFormOpen();
    };

    const closeForm = (clearData = false) => {
        // if (clearData) {
        //     app._generalFormConfig({ title: "", entries: [] });
        //     app._generalFormEntity(undefined);
        // }
        // app.onGeneralFormClose();
    };

    return {
        open: openForm,
        close: closeForm,
    };
}
