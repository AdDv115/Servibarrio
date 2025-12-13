import { StyleSheet } from 'react-native';

const Estilos = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 15,
        backgroundColor: '#0f0f10',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4cc9f0',
        marginTop:70,
        marginBottom: 25,
        textAlign: 'center',
    },

    inputcontainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#18181c',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2a2a32',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
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
        color: '#d1d1d1',
    },

    boton: {
        height: 50,
        width: 140,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4cc9f0',
        borderRadius: 12,
        marginLeft: 0,
    },
    
    textB: {
        color: '#0d0d0e',
        fontWeight: 'bold',
        fontSize: 15
    },

    calendarioBoton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fecha: {
        backgroundColor:'#1f1f25',
        fontSize: 16,
        color: '#d1d1d1',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        flexDirection:'row',
        gap:50
    },

    listaContainer: {
        flex: 1,
        width: '100%',
        marginTop: 10,
    },

    sub: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e0e0e0',
        marginBottom: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(76,201,240,0.3)',
        paddingBottom: 5,
    },

    itemcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#18181c',
        borderRadius: 12,
        borderLeftWidth: 6,
        borderLeftColor: '#4895ef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#d1d1d1',
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
        color: '#9c9c9c',
        marginTop: 4,
    },
    removeBoton: {
        backgroundColor: '#f72585',
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
        color: '#4cc9f0',
        fontWeight: 'bold',
        marginTop: 5,
    },
    statusDone: {
        fontSize: 12,
        color: '#27AE60',
        fontWeight: 'bold',
        marginTop: 5,
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        flexDirection: "row",
    },
    mc: {
        width: "90%",
        backgroundColor: "#18181c",
        borderRadius: 12,
        padding: 24,
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#2a2a32",
    },
    inputmodal: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#1b1b20",
        borderColor: "#2b2b31",
        color: "#d1d1d1",
    },
    botonesmo: {
        gap:20,
        justifyContent:"center",
        flexDirection: "row"
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    flex1: {
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ECF0F1",
    },
    avatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#3498DB",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    menuContainer: {
        position: "absolute",
        top: 50,
        left: 10,
        backgroundColor: "#1b1b1f",
        padding: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginVertical: 12,
    },
    profilePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginVertical: 12,
        backgroundColor: "#ECF0F1",
        alignItems: "center",
        justifyContent: "center",
    },
    profilePlaceholderText: {
        color: "#2C3E50",
    },
    userLabel: {
        marginLeft: 8,
    },
    perfilContainer: {
        paddingTop: 60,
    },
    topAction: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginRight: 8,
    },
    topActionText: {
        color: "#d1d1d1",
        fontSize: 13,
        fontWeight: "600",
    },
});

export default Estilos;
