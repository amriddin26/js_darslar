#Wireless Quality Tool
#Diplom-thesis Hamza Ben Hassen, TU Dresden 2020
#Set com port of receiver log output in main for usb operation
#Set Bluetooth peer adress in main for bluetooth operation
#------------------------------------------------------------------------------------------------------
import sys
import time
import logging
import datetime
from pyqtgraph.Qt import QtCore, QtGui
from PyQt5.QtCore import Qt
import numpy as np
import pyqtgraph as pg
import asyncio
from asyncqt import QEventLoop, asyncSlot, asyncClose
from bleak import BleakClient
from bleak import _logger as logger
import collections
from struct import *
from PyQt5.QtWidgets import (QApplication, QWidget,QSlider, QLabel, QLineEdit, QTextEdit, QPushButton,QVBoxLayout)    
import serial
import serial_asyncio
import itertools   
import ctypes
import pickle

import easygui
from PyQt5.QtWidgets import *

#------------------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------------------

class PacketsPerSecond:
    """[summary]
    initialize with buffer size, call inside event handler to return rate of calls
    Arguments : buffersize : lower buffer size : instantanious  
    """
    def __init__(self,buffersize=1000):
        self.buffer = collections.deque(maxlen=buffersize)
        self.bufferRate=collections.deque(maxlen=buffersize)
        self.currentPPS = 0
        self.currentPacketRate = 0
        self.averageof=buffersize
    def __call__(self):
        self.buffer.append(time.time())
        #self.buffer.append(datetime.datetime.fromtimestamp(time.time()).strftime('%H:%M:%S.%f'))
        if(len(self.buffer) > 1):
            self.currentPPS=len(self.buffer)/(self.buffer[-1]-self.buffer[0])
            self.bufferRate.append(self.currentPPS)            
            return len(self.buffer)/(self.buffer[-1]-self.buffer[0])
        else:
            self.currentPPS=0
            return 0.0
pps = PacketsPerSecond()
ppstx = PacketsPerSecond(5000) 
errorrate = PacketsPerSecond(50)   

class SerialMonitor(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport
        self.buf = bytes()

    def data_received(self, data):
        self.buf += data
        if b'\n' in self.buf:
            lines = self.buf.split(b'\n')
            self.buf = lines[-1]  
            
            for line in lines[:-1]:
                #v=re.findall(b'^-?\d+$', line) 
                try:
                    a=line.split()
                    sentbuffer(int(a[1]),int(a[3]),int(a[5]),int(a[7]))
                    ppstxtext = 'TX Packets Rate :  {fps:.3f} PPS Average of {Frames:} Frames'.format(fps=ppstx(),Frames=pps.averageof)                 
                    thisapp.ppstxlabel.setText(ppstxtext)  
                    
                    try:
                        if (sentbuffer.x[-1]-sentbuffer.x[-2]!=1):
                        
                           print(errorrate()/ppstx.currentPPS *100)      
                    except:
                        pass
                except: 
                    pass
             

    def connection_lost(self, exc):
        print('port closed')
        self.transport.loop.stop()

    def pause_writing(self):
        print('pause writing')
        print(self.transport.get_write_buffer_size())

    def resume_writing(self):
        print(self.transport.get_write_buffer_size())
        print('resume writing')

class DataBuffer:
    """[summary]
    init with buffer size
    call with data to append buffer
    Arguments : buffersize 
    """
    def __init__(self,buffersize=5000):
        self.buffersize = buffersize
        self.x = collections.deque(maxlen=buffersize)
        self.y = collections.deque(maxlen=buffersize)   
        self.z = collections.deque(maxlen=buffersize)
        self.rssi = collections.deque(maxlen=buffersize)
        self.validation = collections.deque(maxlen=buffersize)
        self.timestamps=collections.deque(maxlen=buffersize)
        self.frames = range(buffersize)    
    def __call__(self,x,y,z,rssi):
        self.x.append(x)
        self.y.append(y)
        self.z.append(z)
        self.rssi.append(rssi)
        self.timestamps.append(time.time())
        #Validation : known sequence of sensor x ( increment +1 each packet , over flow at max(int))
        if (x-self.x[-2]==1):            
            self.validation.append(1)
        else:
            self.validation.append(0)        
       
databuffer = DataBuffer()
sentbuffer = DataBuffer()

def notification_handler(sender, data):
    a=unpack("hhh",data)
  
    #databuffer(a[0],a[1],a[2],10)
    sentbuffer(a[0],a[1],a[2],10)
    #ppss = 'RX Packets Rate :  {fps:.3f} PPS Average of {Frames:} Frames'.format(fps=pps(),Frames=pps.averageof)
    #thisapp.ppslabel.setText(ppss)
    ppstxtext = 'TX Packets Rate :  {fps:.3f} PPS Average of {Frames:} Frames'.format(fps=ppstx(),Frames=pps.averageof)                 
    thisapp.ppstxlabel.setText(ppstxtext)     
    #client.get_rssi()
  
class App(QtGui.QMainWindow):
    def __init__(self, parent=None):
        super(App, self).__init__(parent)
        self.isBTconnected=False
        self.isCOMconnected=False
        ########################################################GUI
        self.mainbox = QtGui.QWidget()
        self.setCentralWidget(self.mainbox)
        self.mainbox.setLayout(QtGui.QVBoxLayout())
        self.regionofinterest=[0,1]
        self.canvas = pg.GraphicsLayoutWidget()
        self.mainbox.layout().addWidget(self.canvas)
        self.initialtime=time.time()
        self.label = QtGui.QLabel()
        self.ppstxlabel = QtGui.QLabel()
        self.mainbox.layout().addWidget(self.label)
        self.mainbox.layout().addWidget(self.ppstxlabel)
        self.updateTimer = QtCore.QTimer()
        self.updateTimer.timeout.connect(self._update)
        self.minimum = 1
        self.maximum = 300
        self.x = None 
        self.groupbox = QGroupBox("Controls", checkable=False)
        self.mainbox.layout().addWidget(self.groupbox)
        self.labelx = QtGui.QLabel()
        self.labelx.setText("Draw Framerate Cap")     
        self.hbox = QHBoxLayout()
        self.groupbox.setLayout(self.hbox)
        self.slider = QSlider(self)
        self.slider.setOrientation(Qt.Horizontal)
        self.setLabelValue(self.slider.value())
        self.slider.valueChanged.connect(self.setLabelValue)
        self.btnPause = QPushButton('Pause', self)
        self.btnPause.clicked.connect(self.on_btnPause_clicked)  
        self.btnResume = QPushButton('Resume', self)
        self.btnResume.clicked.connect(self.on_btnResume_clicked)
        self.load = QPushButton('load', self)
        self.load.clicked.connect(self.on_load_clicked)  
        self.save = QPushButton('save', self)
        self.save.clicked.connect(self.on_save_clicked)
        self.btnFetch = QPushButton('BT connect', self)
        self.btnFetch.clicked.connect(self.on_btnFetch_clicked)        
        self.btnDisconnect = QPushButton('Disconnect', self)
        self.btnDisconnect.clicked.connect(self.on_btnDisconnect_clicked)
        self.hbox.addWidget 
        self.hbox.addWidget(self.labelx)
        self.hbox.addWidget(self.slider)
        self.hbox.addWidget(self.btnPause)
        self.hbox.addWidget(self.btnResume)
        self.hbox.addWidget(self.load)
        self.hbox.addWidget(self.save)
        self.hbox.addWidget(self.btnFetch)
        self.hbox.addWidget(self.btnDisconnect)
        self.hbox.addStretch()  
        self.timestampsPAcketRAte=collections.deque(maxlen=5000)        
        ########################################################GUI
        
        #infos
        self.rssiInfoString=""
        self.rssiInfo=pg.TextItem(text="RSSI info",color=(0,255,0),border=(255,255,0),fill=(0,0,0))
        self.signalValidation=pg.TextItem(text="signalValidation",color=(0,255,0),border=(255,255,0),fill=(0,0,0))
        self.packetRateInfo=pg.TextItem(text="signalValidation",color=(0,255,0),border=(255,255,0),fill=(0,0,0))
        self.tempbuffer=[]
        self.tempppstxbuffer=[]
        self.tempgoodframes=[]
        self.slice1=[]
        self.slice2=[]        
        self.run=True
        self.canvas.nextRow()  
        self.counter = 0
        self.fps = 0.
        self.lastupdate = time.time()

        
        #### Start  #####################
        self._update()
    def setLabelValue(self, value):
        self.x = self.minimum + (float(value)*1000 /   (
        self.maximum - self.minimum))
        self.label.setText("Draw Frame Rate: {0:.4g} Hz".format(self.x))
        self.updateTimer.stop()
        self.updateTimer.start(1000/int(self.x))


    def _update(self):
        if self.run == True:
            #dt = 0.000000000001 
            try:
                A=round(thisapp.regionofinterest[0])
                B=round(thisapp.regionofinterest[1])             
                self.tempbuffer=sentbuffer                
                self.slice1 = collections.deque(itertools.islice(sentbuffer.rssi, A, B))
                maxRssi=max(self.slice1)          
                minRssi=min(self.slice1)
                averageRSSI= round(sum(self.slice1)/ len(self.slice1),2) 
                self.slice2 = collections.deque(itertools.islice(sentbuffer.validation, A, B))               
                goodframes=self.slice2.count(1)
                #a=np.diff(self.sentbuffer.timestamps)
                #now = time.time()
                #timestamps = numpy.linspace(now - 3600, now, 4999)              
#
                self.rssiInfo.setText("Max: {0} Min: {1} Average: {2}, Frames: {3} ".format(maxRssi, minRssi,averageRSSI,B-A))
                self.signalValidation.setText("Good packets : {0}%".format(round(goodframes*100/(B-A),2)))
#
                averagePPS= (B-A)/(self.tempbuffer.timestamps[B-1]-thisapp.tempbuffer.timestamps[A])
                self.packetRateInfo.setText("Average PPS : {0}, Frames: {1} ".format(round(averagePPS,2),B-1-A)) 
              
            except:
                pass 
#
            if self.isBTconnected==True:
                if databuffer.x.__len__()==databuffer.frames.__len__():  

                    self.sensor1.setData(databuffer.frames, databuffer.x)
                    self.sensor2.setData(databuffer.frames,databuffer.y)
                    self.sensor3.setData(databuffer.frames,databuffer.z)
                    try:
                        #self.ReceivedFrameRate.setData(pps.buffer, pps.bufferRate)
                        self.ERROR_RATE.setData(databuffer.frames,databuffer.validation)
                    except:
                        pass
                    
                        
                else:
                    self.sensor1.setData(range(databuffer.x.__len__()),databuffer.x)
                    self.sensor2.setData(range(databuffer.y.__len__()),databuffer.y)
                    self.sensor3.setData(range(databuffer.z.__len__()),databuffer.z)
                    try:
                       # self.ReceivedFrameRate.setData(pps.buffer, pps.bufferRate)
                        self.ERROR_RATE.setData(range(databuffer.x.__len__()),databuffer.validation) 
                    except:
                        pass  
                   #                
           
            if self.isCOMconnected==True:

                if sentbuffer.x.__len__()==sentbuffer.frames.__len__():           
                    self.Sentsensor1.setData(databuffer.frames, sentbuffer.x)
                    self.Sentsensor2.setData(databuffer.frames,sentbuffer.y)
                    self.Sentsensor3.setData(databuffer.frames,sentbuffer.z)
                    self.RSSI.setData(databuffer.frames,sentbuffer.rssi)
                    self.ERROR_RATE.setData(databuffer.frames,sentbuffer.validation)
                    #timeinmsec = [ time.localtime(item).tm_sec for item in ppstx.buffer ]
                    timeinmsec = [ (int(round(item * 1000))-round(self.initialtime* 1000))/1000 for item in ppstx.buffer ]                   
                    self.ReceivedFrameRate.setData(timeinmsec, ppstx.bufferRate)
                    #self.ReceivedFrameRate2.setData(sentbuffer.timestamps, databuffer.frames )
                    #self.dPacketRate.setData( collections.deque(itertools.islice(sentbuffer.timestamps, 1, 5000)),np.diff(sentbuffer.timestamps) ) 
                    #self.ReceivedFrameRate2.setData(sentbuffer.timestamps.__delitem__(0), a )
                    #self.ReceivedFrameRate.setData((datetime.datetime.fromtimestamp(value).strftime("%H:%M") for value in ppstx.buffer), ppstx.bufferRate)
                   
                else:
                    self.Sentsensor1.setData(range(sentbuffer.x.__len__()),sentbuffer.x)
                    self.Sentsensor2.setData(range(sentbuffer.y.__len__()),sentbuffer.y)
                    self.Sentsensor3.setData(range(sentbuffer.z.__len__()),sentbuffer.z) 
                    self.RSSI.setData(range(sentbuffer.rssi.__len__()),sentbuffer.rssi)
                    self.ERROR_RATE.setData(range(sentbuffer.validation.__len__()),sentbuffer.validation)
                      

   

           # now = time.time()
           # dt = (now-self.lastupdate)
            #if dt <= 0:
            #    #dt = 0.000000000001
            #    dt = 0.01
           #fps2 = 1.0 / dt
           #self.lastupdate = now
           #self.fps = self.fps * 0.9 + fps2 * 0.1
           #tx = 'Draw Frame Rate:  {fps:.3f} FPS'.format(fps=self.fps )
           #self.label.setText(tx)

            #QtCore.QTimer.singleShot(1, self._update)
            #self.counter += 1



    @asyncSlot()
    async def on_btnFetch_clicked(self):
        self.btnFetch.setEnabled(False)

        await client.connect()
        await client.start_notify(CHAR_UUID, notification_handler)           
        x=await client.is_connected()

        if (x==True):  
            await client.start_notify(CHAR_UUID, notification_handler)
        #else:
        #    logger.info("connecting")
        #    await client.connect()            
        #    await client.start_notify(CHAR_UUID, notification_handler)


    @asyncSlot()
    async def on_btnDisconnect_clicked(self):   
        
        self.btnFetch.setEnabled(True) 
        #x=await client.is_connected()        
        logger.info("Disconnecting")      
        #try:
        #    await client.stop_notify(CHAR_UUID)
        #except:
        #    pass
        await client.disconnect()
                                   
        
      



    @asyncSlot()
    async def on_btnResume_clicked(self):
        self.btnResume.setEnabled(False)
        self.btnPause.setEnabled(True)
        #self._update()
        self.run=True
        self._update()
        logger.info("Resumed")

    @asyncSlot()
    async def on_btnPause_clicked(self):
        logger.info("Paused")
        self.btnResume.setEnabled(True)
        self.btnPause.setEnabled(False)
        self.run=False
        self.tempppstxbuffer=ppstx

    @asyncSlot()
    async def on_load_clicked(self):
        logger.info("loading")
        path = easygui.fileopenbox()
        global sentbuffer,ppstx
        with open(path, 'rb') as f:
            sentbuffer,ppstx = pickle.load(f)
     
           # self.run = False    

       

    @asyncSlot()
    async def on_save_clicked(self):
        logger.info("saving")
        path = easygui.filesavebox()
        with open(path, 'wb') as f:
            pickle.dump([self.tempbuffer, self.tempppstxbuffer], f, pickle.HIGHEST_PROTOCOL)
            #pickle.dump(self.tempbuffer, f, pickle.HIGHEST_PROTOCOL)
       

    def closeEvent(self, event):

        quit_msg = "Are you sure you want to exit the program?"
        reply = QtGui.QMessageBox.question(self, 'Message', 
                         quit_msg, QtGui.QMessageBox.Yes, QtGui.QMessageBox.No)
    
        if reply == QtGui.QMessageBox.Yes:            
            with BleakClient(address, loop=loop , timeout=5.0) as client:     
                client.stop_notify(CHAR_UUID) 
            logger.info("disconnected")
            event.accept()    
        else:
            event.ignore()   


if __name__ == '__main__':

    app = QtGui.QApplication(sys.argv)
    app.setApplicationName("Wireless quality tool")
    loop = QEventLoop(app)
    asyncio.set_event_loop(loop)
    loop = asyncio.get_event_loop()
    thisapp = App()
    


    try:
        coro = serial_asyncio.create_serial_connection(loop, SerialMonitor, 'COM12', baudrate=1000000)      
        loop.run_until_complete(coro)
    except:
        pass    
    thisapp.isCOMconnected=True
    thisapp.p7 = thisapp.canvas.addPlot(title="Received sensor values",rowspan=2)
    thisapp.Sentsensor1 = thisapp.p7.plot(pen=(255,0,0))
    thisapp.Sentsensor2 = thisapp.p7.plot(pen=(0,255,0))
    thisapp.Sentsensor3 = thisapp.p7.plot(pen=(0,0,255))
    
    thisapp.p7.setLabel('left', "Sensor Value")
    thisapp.p7.setLabel('bottom', "Packet")
    thisapp.p7.vb.setLimits(xMin = 1 ,xMax=5000 , yMin=-40000, yMax=40000)
    brush = QtGui.QBrush(QtGui.QColor(0, 255, 255, 10))
    lr = pg.LinearRegionItem([400,700],brush=brush,bounds=(0,5000)) 
    lr2 = pg.LinearRegionItem([4,5],brush=brush) 
    
    lr.setZValue(-10)
    lr2.setZValue(-10)
    thisapp.p7.addItem(lr)
    axis = pg.DateAxisItem()
    axis2 = pg.DateAxisItem()
    axis.labelUnits='s'
    
    axis.labelUnitPrefix=None
    
    #axis.
    
    thisapp.p2 = thisapp.canvas.addPlot(title="Received Packet Rate")
    #thisapp.p2.setAxisItems({'bottom':axis}) 
    thisapp.ReceivedFrameRate=thisapp.p2.plot(pen=(0,255,0))
    thisapp.p2.vb.setLimits( yMin=0, yMax=1500)
    thisapp.p2.showGrid(x=True, y=True)    
    
    thisapp.p2.setLabel('left', "PacketRate", units='Hz')
    thisapp.p2.setLabel('bottom', "Time",units='s' )
    thisapp.p2.setLogMode(x=False, y=False)

       # thisapp.p12 = thisapp.canvas.addPlot(title="Received Packet RateV2")
       # thisapp.p12.setAxisItems({'bottom':axis2}) 
       # thisapp.ReceivedFrameRate2=thisapp.p12.plot(pen=(0,255,0))
       # #thisapp.p12.vb.setLimits( yMin=0, yMax=1100)
       # thisapp.p12.showGrid(x=True, y=True)
       # thisapp.p12.setLabel('left', "PacketRate", units='Hz')
       # thisapp.p12.setLabel('bottom', "Time",units=None)
       # thisapp.p12.setLogMode(x=False, y=False)
       # thisapp.p12.addItem(lr2)
       # thisapp.dPacketRate = thisapp.p12.plot(pen=(0,0,255))
#
       # thisapp.packetRateInfo2 = pg.TextItem(text = "Frames:{3} Max: {0} Min: {1} Average: {2} ".format(10, 0,0,500), color=(0,255,0),border=(255,255,0),fill=(0,50,0))       
       # thisapp.packetRateInfo2.setParentItem(thisapp.p12.vb)


        

    thisapp.packetRateInfo = pg.TextItem(text = "Frames:{3} Max: {0} Min: {1} Average: {2} ".format(10, 0,0,500), color=(0,255,0),border=(255,255,0),fill=(0,50,0))       
    thisapp.packetRateInfo.setParentItem(thisapp.p2.vb)

    thisapp.p8 = thisapp.canvas.addPlot(title="RSSI")
    thisapp.p8.setLabel('left', "RSSI", units='dBm')
    thisapp.p8.setLabel('bottom', "Packet")
    thisapp.p8.showGrid(x=True, y=True)
    thisapp.p8.vb.setLimits(xMin = 1 ,xMax=5000 , yMin=-150, yMax=10)        
    thisapp.rssiInfo = pg.TextItem(text = "Frames:{3} Max: {0} Min: {1} Average: {2} ".format(10, 0,0,500), color=(0,255,0),border=(255,255,0),fill=(0,50,0))       
    thisapp.rssiInfo.setParentItem(thisapp.p8.vb)
    thisapp.canvas.nextRow()
    thisapp.p9 = thisapp.canvas.addPlot(title="Data Validation")
    thisapp.p9.setLabel('left', "Flow Error")
    thisapp.p9.setLabel('bottom', "Packet")
    thisapp.p9.vb.setLimits(xMin = 1 ,xMax=5000 , yMin=-0.1, yMax=1.25)
    thisapp.p9.showGrid(x=True, y=True)
    ay = thisapp.p9.getAxis('left')  # This is the trick
    dy = [(value, str(value)) for value in list((range(0, 2)))]
    ay.setTicks([dy, []])
    thisapp.signalValidation = pg.TextItem(text = "Frames:{3} Max: {0} Min: {1} Average: {2} ".format(10, 0,0,420), color=(0,255,0),border=(255,255,0),fill=(0,50,0))       
    thisapp.signalValidation.setParentItem(thisapp.p9.vb)
    thisapp.RSSI = thisapp.p8.plot(pen=(255,0,0))        
    thisapp.ERROR_RATE = thisapp.p9.plot(pen=(0,255,0))


    def updatePlot():
        thisapp.p8.setXRange(*lr.getRegion(), padding=0)
        thisapp.p9.setXRange(*lr.getRegion(), padding=0)
        #thisapp.p12.setYRange(*lr.getRegion(), padding=0)
        thisapp.regionofinterest=lr.getRegion()
        try:
            A=round(thisapp.regionofinterest[0])
            B=round(thisapp.regionofinterest[1])           
            slice1 = collections.deque(itertools.islice(thisapp.tempbuffer.rssi, A, B))
            maxRssi=max(slice1)          
            minRssi=min(slice1)
            averageRSSI= round(sum(slice1)/ len(slice1),2) 
            slice2 = collections.deque(itertools.islice(thisapp.tempbuffer.validation, A, B))               
            goodframes=slice2.count(1)            
            thisapp.rssiInfo.setText("Max: {0} Min: {1} Average: {2}, Frames: {3} ".format(maxRssi, minRssi,averageRSSI,B-A))
            thisapp.signalValidation.setText("Good packets : {0}%".format(round(goodframes*100/(B-A),2)))
            averagePPS= (B-A)/(thisapp.tempbuffer.timestamps[B]-thisapp.tempbuffer.timestamps[A])              
            thisapp.packetRateInfo.setText("Average PPS : {0}%".format(round(averagePPS,2)))            

        except:
            pass
    
    def updateRegion():
        lr.setRegion(thisapp.p8.getViewBox().viewRange()[0])
       
           
    lr.sigRegionChanged.connect(updatePlot)   
    thisapp.p8.sigXRangeChanged.connect(updateRegion)
    thisapp.p9.sigXRangeChanged.connect(updateRegion)    
    updatePlot()     

    

    #CHAR_UUID = "04831526-6c9d-6ca9-5d41-03ad4fff4abb" 
    CHAR_UUID = "19721403-a294-4354-882c-e66078ec905f"
   # address ="c8:58:10:73:9d:05" 
    #address ="DE:A3:D4:40:CF:86"     
    address = "D7:E7:ED:1B:EF:E6"
    client=BleakClient(address, loop=loop , timeout=5.0)
    l = logging.getLogger("asyncio")
    l.setLevel(logging.DEBUG)
    h = logging.StreamHandler(sys.stdout)
    h.setLevel(logging.DEBUG)
    l.addHandler(h)
    logger.addHandler(h) 
    
    thisapp.show()

    with loop:
        sys.exit(loop.run_forever())