import React, { Component } from 'react'
import { getRandomColor } from '@bit/joshk.jotils.get-random-color'
import Hello from '@bit/joshk.test-with-azure-import.hello';

export default class Alert extends Component {
    render() {
        return <div style={{ backgroundColor: getRandomColor() }}><Hello name={`${this.props.name}`} /></div>
    }
}