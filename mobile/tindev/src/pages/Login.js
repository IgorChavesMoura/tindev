import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';


// import { Container } from './styles';

export default class Login extends Component {
  
    constructor(){
        super();
        this.state = { username:'' }

    }

    componentDidMount(){

        AsyncStorage.getItem('user').then(
            user => {
                if(!!user){
                    this.props.navigation.navigate('Main', { user });
                }
            }
        );

    }

    handleLogin = async () => {

        const response = await api.post('/devs', {
            username:this.state.username
        });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);

        console.log(_id);

        this.props.navigation.navigate('Main', { _id });
    }

    handleChangeText = (username) => {

        this.setState({ username });

    } 

    render() {
        return (

            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={Platform.OS === 'ios'} >  
                <Image source={logo} />
                <TextInput autoCapitalize="none" placeholder="Digite seu usuário no Github" value={this.state.user} onChangeText={this.handleChangeText} placeholderTextColor="#999" style={styles.input} />
                <TouchableOpacity onPress={this.handleLogin} style={styles.button} >
                    <Text style={styles.buttonText} >Enviar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

        );
    }

}


const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },  
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor:'#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button:{
        height: 46,
        alignSelf:'stretch',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#DF4723'
    },
    buttonText:{
        color:'#fff',
        fontWeight:'bold',
        fontSize: 16
    }

});