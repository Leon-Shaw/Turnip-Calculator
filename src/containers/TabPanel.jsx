import React from "react";
import PropTypes from "prop-types";

const TabPanel = ({value, index, children}) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}>
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    children: PropTypes.node,
};

export default TabPanel;