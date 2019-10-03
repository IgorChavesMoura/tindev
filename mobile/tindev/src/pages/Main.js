import React, { Component } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

import { SafeAreaView, Text, View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

// import { Container } from './styles';

export default class Main extends Component {

    constructor() {

        super();
        this.state = {
            user: '',
            devs: [],
            matchDev: undefined
      
        }

    }

    componentDidMount() {

        (async () => {

            console.log(this.props.navigation.getParam('user'));

            this.setState({ user: this.props.navigation.getParam('user') }, async () => {

                const response = await api.get('/devs', {
                    headers: { user: this.state.user }
                });

                console.log(response.data);
                console.log(!!this.state.matchDev);

                this.setState({ devs: response.data });

                const socket = io('http://localhost:3001', {
                    query: { user: this.state.user }
                  });
              
                  socket.on('match', dev => {
                    this.setState({ matchDev:dev });
                  });
                
            });




        })();



    }

    handleLike = async () => {

        const [user, ...rest] = this.state.devs

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: this.state.user }
        });

        this.setState({ devs: rest });


    }

    handleDislike = async () => {

        const [user, ...rest] = this.state.devs

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: this.state.user }
        });

        this.setState({ devs: rest });


    }

    handleLogout = async () => {

        console.log('logout pressed')

        await AsyncStorage.clear();

        this.props.navigation.navigate('Login');

    }

  

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <View>
                    <TouchableOpacity onPress={() => this.handleLogout()} >
                        <Image style={styles.logo} source={logo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardsContainer}>
                    {
                        this.state.devs.length === 0 ? <Text style={styles.empty}>Acabou :(</Text> :
                            this.state.devs.map(
                                (dev, index) => (
                                    <Animated.View key={dev._id} style={[styles.card, { zIndex: this.state.devs.length - index }]}>
                                        <Image style={styles.avatar} source={{ uri: dev.avatar }} />
                                        <View style={styles.footer} >
                                            <Text style={styles.name}>{dev.name}</Text>
                                            <Text style={styles.bio} numberOfLines={3} >{dev.bio}</Text>
                                        </View>
                                    </Animated.View>
                                )
                            )
                    }
                </View>
                {
                    !!this.state.devs.length && (
                        <View style={styles.buttonsContainer} >
                            <TouchableOpacity onPress={() => this.handleDislike()} style={styles.button}>
                                <Image source={dislike} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleLike()} style={styles.button}>
                                <Image source={like} />
                            </TouchableOpacity>
                        </View>
                    )
                }
                {
                    !!this.state.matchDev && (
                        <View style={styles.matchContainer} >
                            <Image style={styles.matchImage} source={itsamatch} />
                            <Image style={styles.matchAvatar} source={{ uri:this.state.matchDev.avatar }} />

                            <Text style={styles.matchName}>{this.state.matchDev.name}</Text>
                            <Text style={styles.matchBio}>{this.state.matchDev.bio}</Text>

                            <TouchableOpacity onPress={() => this.setState({ matchDev:undefined })} >
                                <Text styles={styles.closeMatch} >FECHAR</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        marginTop: 30
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,

    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    avatar: {
        flex: 1,
        height: 300
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor:'rgba(0,0,0,0.8)',
        justifyContent:'center',
        alignItems:'center',
        zIndex: 9999
    },
    matchImage: {
        height:80,
        resizeMode:'contain'
    },  
    matchAvatar: {
        width:160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical:30
    },
    matchName:{
        fontSize:26,
        fontWeight:'bold',
        color:'#FFF'
    },
    matchBio:{
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    closeMatch: {
        fontSize:  16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }


});