import { StyleSheet, Dimensions } from "react-native";

const formularios = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0f0f10',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 24,
    backgroundColor: '#18181c',
    borderRadius: 18,
    width: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    gap: 12,
  },

  title: {
    fontSize: 20,
    color: '#4cc9f0',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  text: {
    fontSize: 16,
    color: '#d1d1d1',
    marginVertical: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  textinput: {
    borderColor: '#2b2b31',
    backgroundColor: '#1b1b20',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
    color: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  inputcontainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  boton: {
    backgroundColor: '#4cc9f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    width: '100%',
    paddingVertical: 12,
    marginTop: 18,
    shadowColor: '#4895ef',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  textB: {
    color: '#0d0d0e',
    fontWeight: 'bold',
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
    backgroundColor: '#1b1b20',
    borderRadius: 15,
    width: '55%',
    color:'#4cc9f0'
  },
  
});

export default formularios;
