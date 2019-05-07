import React, {useState} from 'react'
import {Field, TextInput, Info, Button} from "@aragon/ui";
import styled from "styled-components";

const DeclareTranscoderContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const RewardCut = styled(Field)`
    margin-top: 20px;
`

const DeclareTranscoder = ({handleDeclareTranscoder}) => {

    const [rewardCut, setRewardCut] = useState(0)
    const [feeShare, setFeeShare] = useState(0)
    const [pricePerSegment, setPricePerSegment] = useState(0)

    return (
        <DeclareTranscoderContainer>

            <Info.Action title="Livepeer action">
                This action will declare the Livepeer App as a Transcoder. If it is already declared as a Transcoder it
                will submit the new parameters which will be updated at the start of the next round.
            </Info.Action>

            <RewardCut label="Reward cut (%)">
                <TextInput type="number" wide
                           onChange={event => setRewardCut(event.target.value)}/>
            </RewardCut>

            <Field label="Fee share (%)">
                <TextInput type="number" wide
                           onChange={event => setFeeShare(event.target.value)}/>
            </Field>

            <Field label="Price per segment (wei)">
                <TextInput type="number" wide
                           onChange={event => setPricePerSegment(event.target.value)}/>
            </Field>

            <Button mode="strong" onClick={() => handleDeclareTranscoder(rewardCut, feeShare, pricePerSegment)}>
                Declare Transcoder
            </Button>

        </DeclareTranscoderContainer>
    )
}

export default DeclareTranscoder