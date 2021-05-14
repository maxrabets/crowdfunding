import React, {useCallback, useRef} from 'react';
import { Button, TextField} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useAuth0 } from "@auth0/auth0-react";
import {createComment} from "../apis/commentsApi";

const NewComment = ({campaignId, onAdded}) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const commentRef = useRef();

    const onAdd = useCallback(async () => {
        if(isAuthenticated) {
            const token = await getAccessTokenSilently();
            createComment(campaignId, commentRef.current.value, token)
            .then(newComment => {
                if(newComment) 
                    onAdded(newComment);                
                else
                    alert("error");
            })
        }
    }, [campaignId, getAccessTokenSilently, isAuthenticated, onAdded])

    return (    
        <>    
            <TextField multiline inputRef={commentRef}/>
            <Button variant="contained"  color="primary" onClick={onAdd}>
                <FormattedMessage id="campaigns.comments.add"/>
            </Button>
        </>
    );
}

export default NewComment;