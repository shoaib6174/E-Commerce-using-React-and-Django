
import React from 'react'
import {  Col,  Image, ListGroup, Row } from 'react-bootstrap'
import Message from '../components/Message'
import { useSelector, useDispatch } from 'react-redux';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import {  ORDER_PAY_RESET } from '../constants/orderConstant';

function OrderScreen({match}) {

    
    const orderId = match.params.id
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const  [sdkReady, setSdkReady] = useState(false);

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay


    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((total, item)=>  total + item.price * item.qty, 0).toFixed(2)
    }
    

    const client_id = 'AfdhsyUjdaN5ADhBcAPVIInYTHm8BbolqlOaaeS8vv2qLZlquNnMXCL2iz5c8rQqU1HQNyu-MIs055k_'
    
    const addPayPalScript = () =>{
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${client_id}`
        script.async = true
        script.onload = () =>{
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if(!order || successPay || order._id !== Number(orderId) ){
            dispatch({type:ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            } else{
                setSdkReady(true)
            }
        }
            
    }, [dispatch, order, orderId, successPay]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }
    return  loading ? (
        <Loader/>
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) :(
        <div>
            <h1>Order No: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: {order.user.name}</strong> <br/>
                                <strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong> Address:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {' '}
                                {order.shippingAddress.postalCode}
                                {' '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered On {order.deliveredAt} </Message>
                            ): (
                                <Message variant='warning'> Not Delivered </Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong> Method:</strong>
                                {order.paymentMethod}
                               
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid On {order.paidAt} </Message>
                            ): (
                                <Message variant='warning'> Not Paid </Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Your order is empty.
                            </Message> : ( 
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index)=>(
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
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                           
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Shipping: </Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Tax: </Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            
                            <Row>
                                <Col md={6} xs={6}> Total: </Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader/>}

                                {!sdkReady ? (
                                    <Loader/>
                                ):(
                                    <PayPalButton
                                      amount= {order.totalPrice}
                                      onSuccess={successPaymentHandler}
                                    />
                                )
                                
                                }
                                
                            </ListGroup.Item>
                        )

                        }
                    </ListGroup>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
