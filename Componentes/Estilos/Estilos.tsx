import { StyleSheet } from 'react-native';

const EstilosUnicos = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 15,
        backgroundColor: '#F5F7FA',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 25,
        textAlign: 'center',
    },

    inputcontainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },

    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:40,
        padding:15,
    },

    textinput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 15,
        color: '#333333',
        backgroundColor: 'transparent',
    },

    boton: {
        height: 50,
        width: 140,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1ABC9C',
        borderRadius: 10,
        marginLeft: 0,
    },
    
    textB: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },

    calendarioBoton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },

    fecha: {
        backgroundColor:'#2980B9',
        fontSize: 16,
        color: 'white',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    listaContainer: {
        flex: 1,
        width: '100%',
        marginTop: 10,
    },

    sub: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
        paddingBottom: 5,
    },

    itemcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderLeftWidth: 6,
        borderLeftColor: '#3498DB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '500',
        marginBottom: 2,
    },
    textDone: {
        fontSize: 16,
        color: '#95A5A6',
        textDecorationLine: 'line-through',
    },
    dateText: {
        fontSize: 13,
        color: '#7F8C8D',
        marginTop: 4,
    },
    removeBoton: {
        backgroundColor: '#E74C3C',
        padding: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    removeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statusPending: {
        fontSize: 12,
        color: '#F39C12',
        fontWeight: 'bold',
        marginTop: 5,
    },
    statusDone: {
        fontSize: 12,
        color: '#27AE60',
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default EstilosUnicos;