import React, { useState, useCallback, useEffect } from 'react';
import {FormattedMessage} from "react-intl"
import { Select, MenuItem, Typography, Box } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
import {getCampaignsCount, getCampaignsPage,
     getAllTags} from "../shared/apis/campaignsApi";
import CampaignPreviewCard from "../shared/components/campaigns/CampaignPreviewCard";

const tagifySettings = {		
    maxTags: 10,
    dropdown: {
        maxItems: 4,
        classname: "tags-look",
        enabled: 0,
        closeOnSelect: false 
    }
};

export default function Main() {
    const orders = ["averageRating", "lastModificationDate"];
    const campaignsPerPage = 3;
    const [page, setPage]= useState(1);
    const [order, setOrder]= useState(orders[0]);
    const [pagesCount, setPagesCount]= useState(1);
    const [campaigns, setCampaigns]= useState([]);
    const [allTags, setAllTags]= useState([]);
    const [tags, setTags]= useState([]);

    const getPagesCount = () => {
        getCampaignsCount().then(campaignsCount => {
            if(campaignsCount){
                console.log(Math.ceil(campaignsCount / campaignsPerPage))
                setPagesCount(Math.ceil(campaignsCount / campaignsPerPage));
            }
            else
            console.log("error");
        });
    }
    useEffect(getPagesCount, [])

    const getTags = () => {
        getAllTags().then(tags => {            
            if(tags){
                setAllTags(tags.map(tag => tag.name));
            }
            else
                console.log("error");
        });
    }
    useEffect(getTags, [])

    const getInitialPage = () => {
        getCampaignsPage(1, campaignsPerPage, orders[0], tags).then(campaigns => {
            console.log(campaigns)
            if(campaigns)
                setCampaigns(campaigns);
            else
                console.log("error");            
        });
    }
    useEffect(getInitialPage, []);

    const onPageChange = useCallback((event, newPage) => {
        getCampaignsPage(newPage, campaignsPerPage, order, tags).then(campaigns => {
            if(campaigns)
                setCampaigns(campaigns);
            else
                console.log("error");            
        });
        setPage(newPage);
    }, [order, tags]);

    const onOrderChange = useCallback((event) => {
        const newOrder = event.target.value;
        setOrder(newOrder);
        setPage(1);
        getCampaignsPage(1, campaignsPerPage, newOrder, tags).then(campaigns => {
            if(campaigns)
                setCampaigns(campaigns);
            else
                console.log("error");            
        });
    }, [tags]);

    const onChangeTags = useCallback((event) => {
        console.log(event.detail.value);
        let newTags = event.detail.value ? JSON.parse(event.detail.value) : [];
        //let newTags = JSON.parse(event.detail.value);
        newTags = newTags.map(tag => tag.value);
        console.log(newTags)
        setTags(newTags);
        setPage(1);
        getCampaignsPage(1, campaignsPerPage, order, newTags).then(campaigns => {
            if(campaigns)
                setCampaigns(campaigns);
            else
                console.log("error");
        });
    }, [order]);

    return (
        <Box m={2}>
            <Typography variant="h6"><FormattedMessage id="main.header"/></Typography>
            <Typography><FormattedMessage id="campaigns.tags"/>:</Typography>
            <Tags
                settings={tagifySettings}
                onChange={onChangeTags}
                whitelist= {allTags}
            />
            <Select
                required
                value={order}
                onChange={onOrderChange}
            >
                {orders.map(order => 
                    <MenuItem key={order} value={order}>
                        <FormattedMessage id={`orders.${order}`}>
                    </FormattedMessage></MenuItem>
                )}
            </Select>
            <Box mx={8}>
                <Pagination count={pagesCount} page={page} 
                    onChange={onPageChange}
                />
            </Box>
            {campaigns.map(campaign => 
                <CampaignPreviewCard key={campaign.id} campaign={campaign}/>
            )}
            <Pagination count={pagesCount} page={page} onChange={onPageChange} />
        </ Box>
    )
}