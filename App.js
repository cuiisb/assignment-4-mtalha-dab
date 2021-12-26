import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet,FlatList,Image,TouchableOpacity } from 'react-native';
var axios = require('axios').default;
import Constants from 'expo-constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();  


export default function App() {
  return (
    <NavigationContainer> 
      <Drawer.Navigator initialRouteName="World Statistics Screen">
        <Drawer.Screen
          name="World Statistics Screen"
          component={WorldStatsScreen}
        />

        <Drawer.Screen
          name="Country Statistics Screen"
          component={CountryStatsScreen}
        />

        <Drawer.Screen
          name="Favourite Countries"
          component={FavouriteCountries}
        />
      </Drawer.Navigator>
      
    </NavigationContainer>
  );
}

function WorldStatsScreen() {
  const [data, setData] = useState([]);

  var options = {
    method: 'GET',
    url: 'https://covid-19-data.p.rapidapi.com/totals',
    headers: {
      'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      'x-rapidapi-key': '70ab4f339bmsh8b4828ce1e59411p1eb95ajsne4209e1627be',
    },
  };

  useEffect(() => {
    axios
      .request(options)
      .then(function (response) {
        setData(response.data[0]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> World Covid-19 Statistics </Text>
      <View>
        <Text style={styles.paragraph}>
          Confirmed Cases : <Text style = {{color:"#2da6f7", fontWeight:"bold"}}>{data.confirmed}</Text>{' '}
        </Text>
        <Text style={styles.paragraph}>
          Recovered : <Text style = {{color:"#54d426", fontWeight:"bold"}}>{data.recovered}</Text>{' '}
          <Text style={{fontSize:14, marginLeft:15}}>{(data.recovered/data.confirmed * 100).toFixed(2)} %</Text> 
        </Text>
        <Text style={styles.paragraph}>
          Critical : <Text style = {{color:"red", fontWeight:"bold"}}>{data.critical}</Text>{' '}
            <Text style={{fontSize:14, marginLeft:15}}>{(data.critical/data.confirmed * 100).toFixed(2)} %</Text> 
        </Text>
        <Text style={styles.paragraph}>
          Deaths : <Text style = {{ fontWeight:"bold"}}>{data.deaths}</Text>{' '}
            <Text style={{fontSize:14, marginLeft:15}}>{(data.deaths/data.confirmed * 100).toFixed(2)} %</Text> 
        </Text>
        <Text style={styles.paragraph}>
          Last Updated : <Text>{data.lastUpdate}</Text>{' '}
        </Text>
      </View>
    </View>
  );
}

function CountryStatsScreen (){

return(
  <Stack.Navigator>
 <Stack.Screen name="Country Names" component={CountryNames} />
  <Stack.Screen name="Country Covid Statistics" component={CountryStats} />

  </Stack.Navigator>
)
}


function CountryStats ({route}){
const [countryStat,setCountryStat] = useState([])
const[icon,setIcon] = useState(true)
const {countryName} = route.params;

var options = {
  method: 'GET',
  url: 'https://covid-19-data.p.rapidapi.com/country',
  params: {name: countryName}, 
  headers: {
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    'x-rapidapi-key': '70ab4f339bmsh8b4828ce1e59411p1eb95ajsne4209e1627be'
  }
};


useEffect(()=>{

axios.request(options).then(function (response) {
  setCountryStat(response.data[0])

}).catch(function (error) {
	console.error(error); 
});
},[]) 

return(
<View>

<Text style={styles.heading}> {countryName} Covid-19 Statistics </Text> 
<TouchableOpacity  onPress={()=>setIcon(!icon)}>
<Image style={styles.tinyLogo}
       source={icon?require('./assets/star.png'):require('./assets/favorite.png')}
      />
</TouchableOpacity>
      <View>
        <Text style={styles.paragraph}>
          Confirmed Cases : <Text style = {{color:"#2da6f7", fontWeight:"bold"}}>{countryStat.confirmed}</Text>{' '}
        </Text>
        <Text style={styles.paragraph}>
          Recovered : <Text style = {{color:"#54d426", fontWeight:"bold"}}>{countryStat.recovered}</Text>{' '}<Text style={{fontSize:14, marginLeft:15}}>{(countryStat.recovered/countryStat.confirmed * 100).toFixed(2)} %</Text> 
        </Text>
      <Text style={styles.paragraph}>
          Critical : <Text style = {{color:"red", fontWeight:"bold"}}>{countryStat.critical}</Text>{' '}
          <Text style={{fontSize:14, marginLeft:15}}>{(countryStat.critical/countryStat.confirmed * 100).toFixed(2)} %</Text> 
        </Text>
        <Text style={styles.paragraph}>
          Deaths : <Text style = {{ fontWeight:"bold"}}>{countryStat.deaths}</Text>{' '}
          <Text style={{fontSize:14, marginLeft:15}}>{(countryStat.deaths/countryStat.confirmed * 100).toFixed(2)} %</Text> 
        </Text> 
        <Text style={styles.paragraph}>
          Last Updated : <Text>{countryStat.lastUpdate}</Text>{' '}
        </Text>
        
      </View>
</View>
)
}


function CountryNames({navigation}){
  const [countryNames,setCountryNames] = useState([])

var options = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/allcountriesname',
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': '70ab4f339bmsh8b4828ce1e59411p1eb95ajsne4209e1627be'
  }
};


useEffect(() => {
    axios
      .request(options)
      .then(function (response) {
        setCountryNames(response.data.body.countries);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return(
    <View style={styles.container}>
    <FlatList data={countryNames} 
    renderItem={({item})=>
    <Text style = {{fontSize:18, marginTop:10}}
                  onPress={() => navigation.navigate('Country Covid Statistics',{countryName:item})}

     >
     {item}</Text>}/>
    
    </View>
  )
}

function FavouriteCountries(){
  return(
    <View>
    
    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
 
    marginTop: 10,
    marginLeft:20,
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:40
  },
  tinyLogo:{
   width: 20,
   height:20
  }
});
