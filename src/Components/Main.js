import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import axios from 'axios';
import { Container, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import { BASE_URL_API } from '../Config/Config';
const getCollection = () => {
    return axios.get(BASE_URL_API + "/collections").then(res => {
        return res.data.results;
    })
}
const getLocation = (id) => {
    return axios.get(BASE_URL_API + `/locations?collection_id=${id}`).then(res => {
        return res.data.results;
    })
}
const getActivity = (id) => {
    return axios.get(BASE_URL_API + `/activities?collection_id=${id}`).then(res => {
        return res.data.results;
    })
}
const getProcessData = (locationId, ActivityId) => {
    return axios.get(BASE_URL_API + `/processes?location_id=${locationId}&activity_id=${ActivityId}`).then(res => {
        return res.data.results;
    })
}
export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            collection: [],
            selectedCollection: '',
            location: [],
            selectedLocation: '',
            activities: [],
            selectedActivity: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleChangeActivity = this.handleChangeActivity.bind(this);
    }
    componentDidMount = () => {
        //API Call to Fill Up the Dropdown
        getCollection().then(data => {
            this.setState({
                collection: data
            })
        });
    }
    getActivityValue = (id) => {
        //API to fetch Next Thing
        getActivity(id).then(res => {
            this.setState({
                activities: res,
                selectedActivity: undefined
            });
        })
    }
    getLocationValue = (id) => {
        //API Call to fetch next Step
        getLocation(id).then(res => {
            this.setState({
                location: res,
                selectedLocation: undefined
            })
        })
    }
    getProcess = (activityId) => {
        getProcessData(this.state.selectedLocation, activityId).then(res => {
            console.log(res);
        })
    }
    handleChange = (event) => {
        this.setState({
            selectedCollection: event.target.value
        });
        this.getLocationValue(event.target.value);
        this.getActivityValue(event.target.value);
    }
    handleChangeLocation = (event) => {
        this.setState({
            selectedLocation: event.target.value
        });
    }
    handleChangeActivity = (event) => {
        this.setState({
            selectedActivity: event.target.value
        });
        if (this.state.selectedLocation != undefined) {
            this.getProcess(event.target.value);
        }
    }
    render() {
        return (
            <Container>
                <Row className="item-row">
                    <Col>
                        {this.state.collection && this.state.collection.length > 0 &&
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.selectedCollection}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    {this.state.collection.map(value => {
                                        return <MenuItem value={value.id} key={value.id} name={value.label}>{value.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>}
                    </Col>
                </Row>
                {/* --------------------------------------- Location ---------------------------------------- */}
                <Row className="item-row">
                    <Col>
                        {this.state.location && this.state.location.length > 0 &&
                            <FormControl component="fieldset">
                                <FormLabel component="legend"> Location ( {this.state.selectedCollection.label} )</FormLabel>
                                <RadioGroup value={this.state.selectedLocation} onChange={(e) => this.handleChangeLocation(e)}>
                                    {this.state.location.map(value => {
                                        return <FormControlLabel value={value.id.toString()} control={<Radio />} label={value.name} />
                                    })}
                                </RadioGroup>
                            </FormControl>
                        }
                    </Col>
                </Row>
                <Row className="item-row">
                    <Col>
                        {/* ---------------------------------------Activity---------------------------------------- */}
                        {this.state.activities && this.state.activities.length > 0 &&
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.selectedActivity}
                                    onChange={this.handleChangeActivity}
                                >
                                    {this.state.activities.map(value => {
                                        return <MenuItem value={value.id} name={value.label}>{value.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>}
                    </Col>
                </Row>
            </Container>
        )
    }
}
