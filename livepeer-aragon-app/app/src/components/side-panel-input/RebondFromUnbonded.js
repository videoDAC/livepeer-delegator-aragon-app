import React, {useState} from 'react'
import {Button, Field, TextInput, Info} from "@aragon/ui";
import styled from "styled-components";

const RebondContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const RebondToAddress = styled(Field)`
    margin-top: 20px;
`

const RebondFromUnbonded = ({handleRebondFromUnbonded, unbondingLockId}) => {

    const [bondToAddress, setBondToAddress] = useState("")

    return (
        <RebondContainer>

            <Info.Action title="Livepeer action">
                This action will rebond the tokens in unbonding lock {unbondingLockId} to the specified address.
            </Info.Action>

            <RebondToAddress label="Rebond To Address">
                <TextInput type="text" wide
                           onChange={event => setBondToAddress(event.target.value)}/>
            </RebondToAddress>

            <Button mode="strong" onClick={() => handleRebondFromUnbonded(bondToAddress, unbondingLockId)}>
                Rebond To Address
            </Button>

        </RebondContainer>
    )

}

export default RebondFromUnbonded
