import React, {useState} from "react"
import {Info, TextInput, Button, Field} from "@aragon/ui"
import styled from 'styled-components'

const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const InfoContainer = styled(Info.Action)`
    margin-bottom: 20px;
`

const InputField = ({inputFieldLabel, onChange}) => {

    const handleChange = event => {
        const text = event.target.value;
        onChange(inputFieldLabel, text);
    }

    return (
        <Field label={inputFieldLabel}>
            <TextInput type="text" wide
                       onChange={handleChange}/>
        </Field>
    )
}

// inputFieldList must represent the arguments to handleSubmit and be specified in the same order.
const GenericInputPanel = ({actionTitle, actionDescription, inputFieldList, submitLabel, handleSubmit}) => {

    const [inputFieldData, setInputFieldData] = useState({})

    const handleFieldChange = (fieldId, value) => {
        setInputFieldData({...inputFieldData, [fieldId]: value})
    }

    const inputFields = inputFieldList.map(inputField => (
        <InputField key={inputField.label}
                    inputFieldLabel={inputField.label}
                    onChange={handleFieldChange}
        />
    ));

    return (
        <PanelContainer>

            <InfoContainer title={actionTitle}>
                {actionDescription}
            </InfoContainer>

            {inputFields}

            <Button mode="strong" onClick={() => handleSubmit(...Object.values(inputFieldData))}>
                {submitLabel}
            </Button>
        </PanelContainer>
    )
}

export default GenericInputPanel