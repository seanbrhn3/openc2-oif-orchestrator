import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import * as DeviceActions from '../../../actions/device'
import { withGUIAuth } from '../../../actions/util'

class Transport extends Component {
    constructor(props, context) {
        super(props, context)

        this.checkboxChange = this.checkboxChange.bind(this)
        this.transportRemove = this.transportRemove.bind(this)
        this.transportChange = this.transportChange.bind(this)

        this.state = {
            host: '127.0.0.1',
            port: 8080,
            protocol: 'HTTPS',
            serialization: ['JSON'],
            ...this.props.data
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let props_update = this.props != nextProps
        let state_update = this.state != nextState

        if (props_update && this.mounted) {
            setTimeout(() => this.setState(this.props.data), 10)
        }

        return props_update || state_update
    }

    checkboxChange(e) {
        const name = e.target.name
        const item = e.target.id.replace('checkbox_', '')
        const isChecked = e.target.checked

        let tmpVal = this.state[name]
        let index = tmpVal.indexOf(item)

        if (isChecked) {
            if (index === -1) { tmpVal.push(item) }
        } else {
            if (index >= 0 && tmpVal.length > 1) { tmpVal.splice(index, 1) }
        }

        this.setState(prevState => ({
            [name]: tmpVal
        }), () => {
            this.props.change(this.state, this.props.index)
        })
    }

    transportRemove(e) {
        e.preventDefault()
        this.props.remove(this.props.index)
    }

    transportChange(e, reset=false) {
        let tmpState = {}
        if (reset) {
            tmpState = e
        } else {
            const name = e.target.name
            const value = e.target.value
            tmpState[name] = value
        }

        this.setState(
            tmpState,
            () => {
                this.props.change(this.state, this.props.index)
            }
        )
    }

    render() {
        let protocols = this.props.orchestrator.protocols.map((p, i) => <option key={ i } value={ p }>{ p }</option> )
        let serializations = this.props.orchestrator.serializations.map((s, i) => (
            <div key={ i } className="form-check">
                <input id={ 'checkbox_' +  s } className="form-check-input" name='serialization' type="checkbox" checked={ this.state.serialization.indexOf(s) >= 0 } onChange={ this.checkboxChange } />
                <label className="form-check-label" htmlFor={ 'checkbox_' +  s }>
                    { s }
                </label>
            </div>
        ))

        return (
            <div className='border mb-2 p-2'>
                <Button color="danger" size='sm' className='float-right' onClick={ this.transportRemove } >
                    <FontAwesomeIcon
                        icon={ faTimes }
                    />
                </Button>
                <div className="form-row">
                    <div className="form-group col-lg-6">
                        <label htmlFor="host">Host</label>
                        <input type="text" className="form-control" name='host' value={ this.state.host } onChange={ this.transportChange } />
                    </div>

                    <div className="form-group col-lg-6">
                        <label htmlFor="port">Port</label>
                        <input type="text" className="form-control" name='port' value={ this.state.port } onChange={ this.transportChange } />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-lg-6">
                        <label htmlFor="protocol">Protocol</label>
                        <select className="form-control" name='protocol' value={ this.state.protocol } onChange={ this.transportChange } >
                            { protocols }
                        </select>
                    </div>

                    <div className="form-group col-lg-6">
                        <p style={{
                            display: 'inline-block',
                            marginBottom: '0.5rem'
                        }}>Serializations</p>
                        { serializations }
                    </div>
                </div>
            </div>
        )
    }
}

Transport.propTypes = {
    data: PropTypes.object,
    change: PropTypes.func,
    remove: PropTypes.func,
};

Transport.defaultProps = {
    data: {},
    change: (d, i) => {},
    remove: (i) => {}
};

function mapStateToProps(state) {
    return {
        orchestrator: {
            // ...state.Orcs.selected,
            protocols: state.Util.protocols,
            serializations: state.Util.serializations,
        }
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transport)