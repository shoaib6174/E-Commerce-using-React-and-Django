
import React, { useState } from 'react'
import { Button, Form, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useSelector, useDispatch } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen({history}) {

    const cart = useSelector(state => state.cart)   
    const {shippingAddress} = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    if(!shippingAddress.address){
        history.pushState('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        console.log(e.target.value, paymentMethod)
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check 
                                type='radio'
                                label='PayPal or Credit Card'
                                id='paypal' //may change this in future
                                name='paymentmethod'
                                checked
                                onChange={(e)=>setPaymentMethod(e.target.value)}
                            >
                            </Form.Check>

                            
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
