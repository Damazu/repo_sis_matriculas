class Cobrança:
    def __init__(self, tempoDivida,valorCobrança,juros, pago):#construtor
        self.tempoDivida = tempoDivida
        self.valorCobrança = valorCobrança
        self.juros = juros
        self.pago = pago

    def enviarCobranca(self):    
        print('')
