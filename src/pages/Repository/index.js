import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Browser } from './styles';

export default class Repository extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repo').name,
    });
    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired
    }
    render() {
        const { navigation } = this.props;
        const repo = navigation.getParam('repo');
        
        // console.tron.log(`url: ${repo.html_url}`);
        // return <View><Text>{repo.html_url}</Text></View>; // teste
                /**
                 *  Antes de copiar o codigo pronto, estava importando o webview diretamente aqui 
                 * nesse arquivo porém dava o mesmo erro.
                 */ 

        return <Browser source={{ uri: repo.html_url }} />;
    }
}
