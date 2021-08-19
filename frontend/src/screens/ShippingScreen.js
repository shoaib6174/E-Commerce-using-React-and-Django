import React, { useState } from 'react'
import { Button, Form, FormLabel } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingScreen({history}) {
    
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        history.push('/payment')
    }

    return (
        
        <FormContainer>
            <CheckoutSteps step1 step2/>

            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>

               <Form.Group controlId='address'>
                    <FormLabel>Address:</FormLabel>
                    <Form.Control
                    required
                    type='text'
                    placeholder='Enter Address'
                    value={address ? address : ''}
                    onChange={(e)=>setAddress(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <FormLabel>City:</FormLabel>
                    <Form.Control
                    required
                    type='text'
                    placeholder='Enter City'
                    value={city ? city : ''}
                    onChange={(e)=>setCity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <FormLabel>Postal Code:</FormLabel>
                    <Form.Control
                    required
                    type='text'
                    placeholder='Enter PostalCode'
                    value={postalCode ? postalCode : ''}
                    onChange={(e)=>setPostalCode(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <FormLabel>Country:</FormLabel>
                    <Form.Control
                    required
                    type='text'
                    placeholder='Enter Country'
                    value={country ? country : ''}
                    onChange={(e)=>setCountry(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
