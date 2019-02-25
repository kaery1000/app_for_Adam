import React, { Component } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import {Link} from 'react-router-dom';


function linkFromatter(cell, row) {
    const url= `/products/${cell}`;
    return (
        <Link to={url}>{cell}</Link>
    )
}

class Fib extends Component {
    state = {
        products: [],
        // values: {},
        product_code: '',
        product_description: '',
        columns: [{
            dataField: 'id',
            text: 'Product ID',
            formatter: linkFromatter
          }, {
            dataField: 'product_code',
            text: 'Product Code'
          }, {
            dataField: 'description',
            text: 'Product Description'
          }]
    };


    componentDidMount() {
        // this.fetchValues();
        this.fetchIndexes();
    }


    // async fetchValues() {
    //     const values = await axios.get('/api/values/current');
    //     this.setState({values: values.data});
    // }

    async fetchIndexes() {
        const products = await axios.get('/api/products');
        console.log(products);
        this.setState({products: products.data});
    }

    // renderTable() {

        

    //     return this.state.seenIndexes.map(({ number }) => number).join(', ');
    // }

    handleSubmit = async (event) => {
        event.preventDefault();

        const product = {
            product_code: this.state.product_code,
            description: this.state.product_description
        };
        console.log('from client ', product.product_code, product);

        axios.post('/api/products', {
            product: product
        });

        this.setState({ product_code: '', product_description: ''});
    }

    // renderValues() {
    //     const entries = [];

    //     for (let key in this.state.values) {
    //         entries.push(
    //             <div key = {key}>
    //                 For index {key} I calculated {this.state.values[key]}
    //             </div>
    //         );
    //     }

    //     return entries;
    // }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label> Product Code: 
                        <input 
                        type="text"
                        placeholder="Product Code"
                        value={this.state.product_code}
                        onChange={event => this.setState({product_code: event.target.value})}
                        />
                    </label><br />
                    <label> Description: 
                        <textarea 
                        type="text"
                        placeholder="Description"
                        value={this.state.product_description}
                        onChange={event => this.setState({product_description: event.target.value})}
                        />
                    </label><br />
                    <button>Add Product</button>
                </form>

                <BootstrapTable 
                    keyField='id' 
                    data={ this.state.products } 
                    columns={ this.state.columns }
                    bootstrap4={true}  
                    striped
                    hover
                    condensed/>
            </div>


        )
    }
}

export default Fib;