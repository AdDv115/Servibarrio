import { StyleSheet, Dimensions } from "react-native";

const formularios = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 20,
    backgroundColor:'white',
    borderRadius: 15,
    width: '90%',
    elevation: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    gap:10
  },

  title: {
    fontSize: 20,
    color: '#000000ff',
    marginBottom: 15,
    fontWeight:'bold',
    textAlign:'center'
  },

  text: {
    fontSize: 16,
    color: '#6f6f6f',
    marginVertical: 5,
    fontWeight:'bold',
    textAlign:'left'
  },

  textinput: {
    borderColor: '#6f6f6f',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    marginVertical: 5,
    alignItems:'center'
  },

  inputcontainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  boton: {
    backgroundColor: '#1ABC9C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '100%',
    paddingVertical: 10,
    marginTop: 15,
    
  },
  textB: {
    color:'white',
    fontWeight:'bold'
  },

  itemcontainer: {
    paddingVertical: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textDone: {
    fontSize: 16,
    color: 'darkgreen',
    textDecorationLine: 'line-through',
  },

  removeBoton: {
    backgroundColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
    color: 'white',
  },

  removeText: {
    color: 'white',
  },

  ContBoton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
  },

  picker: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '55%'
  },
  
});

export default formularios;