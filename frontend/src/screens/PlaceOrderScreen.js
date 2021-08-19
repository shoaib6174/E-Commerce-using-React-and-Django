
import React, { useState } from 'react'
import { Button, Col, Form, FormLabel, Image, ListGroup, Row } from 'react-bootstrap'
import Message from '../components/FormContainer'
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import { useEffect } from 'react';
import { ORDER_CREATE_RESET } from '../constants/orderConstant';

function PlaceOrderScreen({history}) {

    const orderCreate = useSelector(state => state.orderCreate)
    const {order, error, success} = orderCreate

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)


    cart.itemsPrice = cart.cartItems.reduce((total, item)=>  total + item.price * item.qty, 0).toFixed(2)

    //delivery cost
    cart.shippingPrice = cart.shippingAddress.city === 'Dhaka' || 'dhaka' || 'dhk' ? 60.00 : 100.00
    //tax
    cart.taxRate = Number(0.05)
    cart.taxPrice = (cart.taxRate * cart.itemsPrice).toFixed(2)
    //total
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if(!cart.paymentMethod){
        history.push('/payment')
        dispatch({type: ORDER_CREATE_RESET})
    }

    const t = cart.totalPrice

    useEffect(() => {
        
        if(success){
            history.push(`/order/${order._id}`)
            dispatch({type: ORDER_CREATE_RESET})
        } 
            
    }, [success, history]);

    const placeOrderHandler = ()=>{ 

        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice : cart.itemsPrice,
            shippingPrice : cart.shippingPrice,
            taxPrice : cart.taxPrice,
            totalPrice: cart.totalPrice

    }))
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>

                            <p>
                                <strong> Address:</strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {' '}
                                {cart.shippingAddress.postalCode}
                                {' '}
                                {cart.shippingAddress.Country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong> Method:</strong>
                                {cart.paymentMethod}
                               
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty.
                            </Message> : ( 
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index)=>(
                                        <ListGroup.Item className={`productNo-${index}`}>
                                            <Row>
                                                <Col  md={1} >
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <ListGroup>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col md={6} xs={6}> Items: </Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                           
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Shipping: </Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Tax: </Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Total: </Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            
                            <Button 
                            type='button'
                            className='btn-block'
                            variant='primary'
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
