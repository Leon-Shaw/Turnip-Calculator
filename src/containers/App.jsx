import React from "react";
import {Container, Box} from "@mui/material";
import {useTitle, useTabs} from "../utils";
import {Title, Footer, IslandTabs, Calculator} from "../containers";


const App = () => {
    useTitle();
    const {tabs, addTab, deleteTab, value, handleTabChange} = useTabs();
    const panelMarkup = tabs.map((tab, index) => (
        <Calculator filterKey={tab.key} key={tab.key} value={value} index={index}/>
    ));

    return (
        <>
            <Container maxWidth="md">
                <Title/>
                <Box mx={[-1.5, 0]}>
                    <IslandTabs value={value} tabs={tabs} onAdd={addTab} onDelete={deleteTab}
                                onChange={handleTabChange}/>
                    {panelMarkup}
                    <Footer/>
                </Box>
            </Container>
        </>
    );
};

export default App;
