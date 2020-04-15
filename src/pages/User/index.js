import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, RefreshControl } from 'react-native';
import api from '../../services/api';

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author } from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired
  }

  state = {
    stars: [],
    loading: false,
    page: 1,
    perPage: 30,
    isRefreshing: false,
  }

  async componentDidMount() {
    // console.tron.log('antes');
    this.loadMore();
  }

  loadMore = async () => {

    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, page, perPage } = this.state;
    
    this.setState({ loading: true });

    await api.get(`/users/${user.login}/starred?per_page=${perPage}&page=${page}`)
      .then(res => {
        let data = res.data;
        this.setState({ loading: false, stars: [ ... stars, ... data ], page: page + 1 });
        // console.tron.log('depois');
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Erro ao buscar dados' });
      });
  }

  refreshList() {
    
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, perPage } = this.state;
    this.setState({ isRefreshing: true });

    // console.tron.log('entrou no refresh');
    api.get(`/users/${user.login}/starred?per_page=${perPage}&page=1`)
      .then(res => {
        let data = res.data.items
        this.setState({ isRefreshing: false, stars: [ ... stars, ... data ] });
      })
      .catch(error => {
        this.setState({ isRefreshing: false, error: 'Erro ao buscar dados' });
      });
  }

  renderFooter = () => {
    const { loading } = this.state;

     if (!loading) return null;
     return (
      <ActivityIndicator color="#7159c1" />
     );
   };

   handleRepoNavigate = repo => {
    const { navigation } = this.props;
    
    navigation.navigate('Repository', { repo });
  }

  render(){
    
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const { stars, loading, isRefreshing, page, perPage } = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{ user.name }</Name>
          <Bio>{ user.bio }</Bio>
        </Header>

        { loading && page === 1 ? (
              <ActivityIndicator color="#7159c1" />
            ) : (
              <Stars 
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={this.refreshList.bind(this)}
                  />
                }
                data={stars}
                keyExtractor={star => String(star.id)} 
                onEndReachedThreshold={0.2} 
                onEndReached={this.loadMore.bind(this)} 
                renderItem={({ item }) => (
                  <Starred>
                    <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                    <Info>
                      <Title onPress={() => this.handleRepoNavigate(item)}>{item.name}</Title>
                      <Author>{item.owner.login}</Author>
                    </Info>
                  </Starred>
                )}
                  // ListFooterComponent={this.renderFooter.bind(this)} 
              />
            )}
            
      </Container>
    );

  }
}
