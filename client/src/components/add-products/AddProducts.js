import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import UploadImage from "../common/UploadImage";

import { createProduct } from "../../actions/productActions";

class AddProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: "",
      description: "",
      category: "",
      quantity: "",
      price: "",
      errors: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const productData = {
      name: this.state.name,
      image: this.state.image,
      description: this.state.description,
      category: this.state.category,
      quantity: this.state.quantity,
      price: this.state.price
    };

    this.props.createProduct(productData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    // Select options for shoes type
    const options = [
      { label: "* Select shoe category", value: 0 },
      { label: "Brogues", value: "Brogues" },
      { label: "Loafers", value: "Loafers" },
      { label: "Oxfords", value: "Oxfords" },
      { label: "Moccasins", value: "Moccasins" },
      { label: "Sneakers", value: "Sneakers" },
      { label: "Slip-ons", value: "Slip-ons" }
    ];

    return (
      <div className="add-products">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Add New Product</h1>
              <p className="lead text-center">
                Enter the following information
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Enter Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="A unique name for the shoe"
                />
                <SelectListGroup
                  placeholder="Category"
                  name="category"
                  value={this.state.category}
                  options={options}
                  onChange={this.onChange}
                  error={errors.category}
                  info="Which category does the shoe belongs to"
                />
                <TextAreaFieldGroup
                  placeholder="Short Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="A short description about what out stands this shoe"
                />
                <TextFieldGroup
                  placeholder="* Quantity"
                  name="quantity"
                  type="number"
                  value={this.state.quantity}
                  onChange={this.onChange}
                  error={errors.quantity}
                  info="Number of this article in the stock"
                />
                <TextFieldGroup
                  placeholder="* Price"
                  name="price"
                  value={this.state.price}
                  onChange={this.onChange}
                  error={errors.price}
                  info="The selling price of the shoe"
                />
                <UploadImage
                  name="image"
                  value={this.state.image}
                  onChange={this.onChange}
                  error={errors.image}
                  type="file"
                  info="Upload image of the product"
                />

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddProducts.propTypes = {
  createProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProduct }
)(AddProducts);
