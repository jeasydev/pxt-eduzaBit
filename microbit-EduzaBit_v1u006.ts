/**
 * Provides access to basic micro:bit functionality. ใส่สีใช้ // กับ % ด้วยสีแบบ hue \uf1ee
 * 
 * เพิ่ม analog pin และ analogRead() สำหรับใช้ร่วมกับบอร์ด iKB1 จาก inex
 */
//% block="stdio" color=80 weight=199 icon="\u26D3"
namespace stdio {
    export let A0: number = iKB1ADC.ADC0;
    export let A1: number = iKB1ADC.ADC1;
    export let A2: number = iKB1ADC.ADC2;
    export let A3: number = iKB1ADC.ADC3;
    export let A4: number = iKB1ADC.ADC4;
    export let A5: number = iKB1ADC.ADC5;
    export let A6: number = iKB1ADC.ADC6;
    export let A7: number = iKB1ADC.ADC7;

    export let D0: number = pinx.D0;
    export let D1: number = pinx.D1;
    export let D2: number = pinx.D2;
    export let D3: number = pinx.D3;
    export let D4: number = pinx.D4;
    export let D5: number = pinx.D5;
    export let D6: number = pinx.D6;
    export let D7: number = pinx.D7;


    /**
    * อ่านค่าสัญญาณแอนะล็อกจากเซนเซอร์ตามพอร์ทที่ระบุ
    * @param ap ระบุ analogPort ที่ต้องการอ่านค่าจากเซนเซอร์; ตัวอย่างเช่น: stdio.A0
    */
    //% help=stdio/analog-read
    //% block="analogRead(%ap)"
    export function analogRead(ap: number): number {
        return iKB1.ADC(ap);
    }

    /**
    * เขียนค่าสัญญาณดิจิทัลออกไปยังพอร์ทที่ระบุ
    * @param dp ระบุ digitalPort ที่ต้องการเขียนค่าออกไปควบคุม; ตัวอย่างเช่น: stdio.D0
    * @param v ระบุสัญญาณดิจิทัลที่ต้องการเขียนออกไปยังอุปกรณ์ ; ตัวอย่างเช่น: 1 หรือ 0
    */
    //% help=stdio/digital-write
    //% block="digitalWrite(%dp, %v)"
    export function digitalWrite(dp: number, v: number): void {
        iKB1.out(pinx.D0, v);
    }

    /**
    * อ่านค่าสัญญาณดิจิทัลจากเซนเซอร์ตามพอร์ทที่ระบุ
    * @param dp ระบุ digitalPort ที่ต้องการอ่านค่าจากเซนเซอร์; ตัวอย่างเช่น: stdio.D0
    */
    //% help=stdio/digital-read
    //% block="analogRead(%ap)"
    export function digitalRead(dp: number): number {
        return iKB1.In(dp)
    }
}

/**
 * EduzaBit Namespace
 */
//%block="EduzaBit" color=16 weight=200 icon="\u26D0"
namespace EduzaBit {

    let enc2state2: number = 0;
    let enc1state2: number = 0;
    let enc0state2: number = 0;
    let enc3state2: number = 0;
    let encCnt3: number = 0;
    let encCnt2: number = 0;
    let encCnt1: number = 0;
    let encCnt0: number = 0;
    let enc0state: number = pins.digitalReadPin(DigitalPin.P1);
    let enc1state: number = pins.digitalReadPin(DigitalPin.P16);
    let enc2state: number = pins.digitalReadPin(DigitalPin.P8);
    let enc3state: number = pins.digitalReadPin(DigitalPin.P12);

    export function resetEnc1(): void {
        encCnt0 = 0;
    }

    export function resetEnc16(): void {

        encCnt1 = 0;

    }

    export function resetEnc8(): void {

        encCnt2 = 0;

    }

    export function resetEnc12(): void {

        encCnt3 = 0;

    }

    function _encoder(channel: number): number {
        switch (channel) {
            case 12:
                return encCnt3;
                break;
            case 8:
                return encCnt2;
                break;
            case 1:
                return encCnt0;
                break;
            case 16:
                return encCnt1;
                break;
            default:
                return 0;
        }
        //basic.pause(1); //fixed encoder notworking bug
    }



    /**
     * using wrapper technic to fix encoder notworking bug by basic.pause(1)
     */
    export function encoder(channel: number): number {
        let enc: number = _encoder(channel);
        basic.pause(1); //fixed encoder notworking bug
        return enc;
    }

    control.inBackground(function () {
        while (true) {
            enc0state2 = pins.digitalReadPin(DigitalPin.P1);
            enc1state2 = pins.digitalReadPin(DigitalPin.P16);
            enc2state2 = pins.digitalReadPin(DigitalPin.P8);
            enc3state2 = pins.digitalReadPin(DigitalPin.P12);
            basic.pause(1);//fixed encoder not working bug
            if (enc0state != enc0state2) {
                encCnt0 += 1;
                enc0state = enc0state2;
            }
            if (enc1state != enc1state2) {
                encCnt1 += 1;
                enc1state = enc1state2;
            }
            if (enc2state != enc2state2) {
                encCnt2 += 1;
                enc2state = enc2state2;
            }
            if (enc3state != enc3state2) {
                encCnt3 += 1;
                enc3state = enc3state2;
            }
        }
        //basic.pause(1);
    })

    /**
     * 
     */
    //% blockNamespace=EduzaBit
    export class LineTrackingCar {
        //การใช้คลาส let greeter = new Greeter("world");
        private cmDiameterOfWheel: number;
        private cmDirectionWheelToWheel: number;
        private threshold: number;
        private motorFwSpeed: number;
        private motorRvSpeed: number;
        private crosslineCheck: number;
        private line1Check: number;
        private line2Check: number;
        private crosslineCount: number;

        /**
         * constructor
         * @param cmDiameterOfWheel เส้นผ่านศูนย์กลางของล้อในหน่วยเซนติเมตร; ตัวอย่างเช่น: 7
         * @param cmDirectionWheelToWheel ระยะห่างระว่างล้อทั้งสองข้างในหน่วยเซนติเมตร; ตัวอย่างเช่น: 25
         */

        //% help=EduzaBit/LineTrackingCar/constructor
        constructor(cmDiameterOfWheel: number, cmDirectionWheelToWheel: number) {
            this.cmDiameterOfWheel = cmDiameterOfWheel;
            this.cmDirectionWheelToWheel = cmDirectionWheelToWheel;
            this.threshold = 0;
            this.motorFwSpeed = 0;
            this.motorRvSpeed = 0;
            this.crosslineCheck = 0;
            this.line1Check = 0;
            this.line2Check = 0;
        }

        /**
        * แปลงค่า ระยะทาง centimeter ให้เป็นจำนวน encoder step
        * @param cm ระบุระยะทางเป็นเซนติเมตร; ตัวอย่างเช่น: 25
        */
        //% help=EduzaBit/LineTrackingCar/get-step-by-cm
        //% block="%EduzaBit(ltCar).getStepByCm(%cm)"
        //% weight=1
        public getStepByCm(cm: number): number {
            return Math.round((40 / (Math.PI * this.cmDiameterOfWheel)) * cm);
        }


        /**
        * ติดตามเส้น
        * @param threshold ค่ากลางในการแบ่งแยกระหว่างขาวกับดำของเซนเซอร์ตรวจจับเส้น
        * @param analogInput1 ระบุขาที่ต่อกับ encoder ตัวที่ 1; ตัวอย่างเช่น: A5
        * @param analogInput2 ระบุขาที่ต่อกับ encoder ตัวที่ 2; ตัวอย่างเช่น: A6
        * @param crosslineCallback ระบุ callbackFunction(crosslineCount: number) ที่จะทำงานในขณะเดินตามเส้น; ตัวอย่างเช่น: function(crosslineCount: number){ }
        */
        //% help=EduzaBit/LineTrackingCar/track-line
        //% block="%EduzaBit(ltCar).trackLine(%threshold, %analogInput1, %analogInput2)"
        //% weight=90
        //*% inlineInputMode=inline
        public trackLine(threshold: number, analogInput1: number, analogInput2: number, crosslineCallback: (crosslineCount: number) => void): void {
            this.threshold = threshold;
            let motorFwSpeed: number = 46;   // motorFwSpeed;
            let motorRvSpeed: number = 38;  //motorRvSpeed;
            let a1 = stdio.analogRead(analogInput1);  //A6
            let a2 = stdio.analogRead(analogInput2);  //A5
            if (a1 < this.threshold) {
                if (a2 < this.threshold) {
                    this.crosslineCheck++;
                }
                //motor(1, motorRvSpeed);
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Backward, motorRvSpeed)
            } else {
                //this->line1Check = 0;  //reset
                //motor(1, motorFwSpeed);
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Forward, motorFwSpeed)
            }
            if (a2 < this.threshold) {
                if (a1 < this.threshold) {
                    this.crosslineCheck++;
                }
                //motor(2, motorRvSpeed);
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Backward, motorRvSpeed)
            } else {
                //this->line2Check = 0;  //reset
                //motor(2, motorFwSpeed);
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Forward, motorFwSpeed)
            }
            //found intersection
            if (this.crosslineCheck >= 2) {
                this.crosslineCheck = 0;  //reset
                //motor(1, motorFwSpeed);
                //motor(2, motorFwSpeed);
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Forward, motorFwSpeed)
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Forward, motorFwSpeed)
                basic.pause(100);//debounce
                crosslineCallback(++this.crosslineCount);
            }
            this.crosslineCheck = 0;  //reset
            //this->line1Check = 0;
            //this->line2Check = 0;
            //digitalWrite(16, 0);  //reset led
        }

        private runStep(m1cm: number, m2cm: number): boolean {
            let isM1Finished: boolean = false;
            let isM2Finished: boolean = false;
            let enc1 = encoder(8);
            let enc2 = encoder(12);
            //หลังใช้ encoder(n) ต้อง pause(1)เสมอ ไม่งั้น encoder ไม่ทำงาน
            //ใส่ใน wrapper class แล้ว **ยังไม่รู้สาเหตุ แต่ถ้าไม่ใส่มอเตอร์จะหมุนไม่หยุด
            //basic.pause(1);// fixed encoder not working bug
            //I2C_LCD1602.ShowString(enc1.toString()+ "          "+ enc2.toString(), 11, 1)
            if (enc1 > this.getStepByCm(m1cm)) {
                //motor(1, 0);
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Forward, 0);
                isM1Finished = true;
            }
            if (enc2 > this.getStepByCm(m2cm)) {
                //motor(2, 0);
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Forward, 0);
                isM2Finished = true;
            }
            if (isM1Finished && isM2Finished) {
                iKB1.AO()
                return false;
            }
            return true;
        }



        /**
        *  ใช้สั่งให้วิ่งไปข้างหน้า
        *  @param  m1cm            ระยะทางเป็นเซนติเมตรของมอเตอร์ 1
        *  @param  m2cm            ระยะทางเป็นเซนติเมตรของมอเตอร์ 2
        *  @param  motor1Speed     ความเร็วมอเตอร์ 1 ในช่วง [-100, 100]
        *  @param  motor2Speed     ความเร็วมอเตอร์ 2 ในช่วง [-100, 100]
        */
        //% help=EduzaBit/LineTrackingCar/run
        //% weight=80
        //% block="%EduzaBit(ltCar).run(%m1cm, %m2cm, %motor1Speed, %motor2Speed)"
        public run(m1cm: number, m2cm: number, motor1Speed: number, motor2Speed: number, runCallback: () => void): void {
            resetEnc8();
            resetEnc12();
            //motor(1, motor1Speed);
            //motor(2, motor2Speed);
            if (motor1Speed < 0) {
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Backward, -1 * motor1Speed)
            } else {
                iKB1.setMotor(iKB1MotorCH.M1, iKB1Motor.Forward, motor1Speed)
            }
            if (motor2Speed < 0) {
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Backward, -1 * motor2Speed)
            } else {
                iKB1.setMotor(iKB1MotorCH.M2, iKB1Motor.Forward, motor2Speed)
            }
            while (this.runStep(m1cm, m2cm)) {
                runCallback();
            }
            basic.pause(1);  //debounce
            //iKB1.AO();//
        }


        /**
        * runCallback ใส่ ? เพื่อบอกว่า parameter ตัวนี้เป็น option ใส่ไม่ใส่ก็ได้
        * นอกจากนี้ parameter ยังสามารถกำหนดแบบหลายชนิดข้อมูลได้เช่น
        * forward(cm: number|string, xxx:number)
        * @param cm ระบุระยะที่ต้องการเดินหน้าในหน่วยเซนติเมตร; ตัวอย่างเช่น: 5 หมายถึงเดินหน้า 5 เซนติเมตร
        * @param motorSpeed ระบุความเร็วในการหมุนมอเตอร์ล้อในช่วง [-100, 100]; ตัวอย่างเช่น: 25
        * @param runCallback ระบุ callbackFunction() ที่จะทำงานในขณะเดินหน้า; ตัวอย่างเช่น: function(){ }
        */
        //% help=EduzaBit/LineTrackingCar/forward
        //% weight=70
        //% block="%EduzaBit(ltCar).forward(%cm, %motorSpeed)"
        public forward(cm: number, motorSpeed: number, runCallback?: () => void): void {
            //overload function in typescript
            if (typeof runCallback == 'undefined') {
                this.run(cm, cm, motorSpeed, motorSpeed, function () { });
            } else {
                this.run(cm, cm, motorSpeed, motorSpeed, runCallback);
            }
        }

        /**
         * 
         */
        //% block="%EduzaBit(ltCar).backward(%cm, %motorSpeed)"
        //% weight=50
        public backward(cm: number, motorSpeed: number): void {
            this.run(cm, cm, -1 * motorSpeed, -1 * motorSpeed, function () { });
        }

        /**
         * 
         */
        //% block="%EduzaBit(ltCar).turnRight()"
        //% weight=40
        public turnRight(): void {
            let dist = this.getStepByCm((((this.cmDirectionWheelToWheel) * Math.PI) / 4) / 2);
            this.run(dist, dist, 52, -52, function () { });
        }

        /**
         * 
         */
        //% block="%EduzaBit(ltCar).turnLeft()"
        //% weight=30
        public turnLeft(): void {
            let dist2 = this.getStepByCm((((this.cmDirectionWheelToWheel) * Math.PI) / 4) / 2);
            this.run(dist2, dist2, -52, 52, function () { });
        }

        /**
         * หมุนขาวไปที่องศาที่่ระบุใน angle
         */
        //% block="%EduzaBit(ltCar).turnRightTo(%angle)"
        //% weight=20
        public turnRightTo(angle: number): void { }

        /**
         * 
         */
        //% block="%EduzaBit(ltCar).turnLeftTo(%angle)"
        //% weight=10
        public turnLeftTo(angle: number): void { }

        /**
         *
         * หมุนขวาเป็นจำนวนองศา จากองศาเดิม
         */
        //% block="%EduzaBit(ltCar).right(%angle)"
        //% weight=9
        public right(angle: number) { }

        /**
         * 
         */
        //% block="%EduzaBit(ltCar).left(%angle)"
        //% weight=8
        public left(angle: number) { }
    }

    /**
    * ให้หยุดรอจนกว่าจะมีการกดปุ่ม A
    */
    //% help=functions/sw_a_press
    //% block
    //% weight=99
    export function sw_a_press(): void {
        while (!input.buttonIsPressed(Button.A));
    }



    /**
    * Create a LineTrackingCar Instance and automtically set it to a variable
    * @param cmDiameterOfWheel ระบุเส้นผ่านศูนย์กลางของล้อในหน่วยเซนติเมตร; ตัวอย่างเช่น: 7
    * @param cmDirectionWheelToWheel ระบุระยะห่างระว่างล้อทั้งสองข้างในหน่วยเซนติเมตร; ตัวอย่างเช่น: 25
    */
    //% help=functions/new-line-tracking-car
    //% block="newLineTrackingCarInstance(%cmDiameterOfWheel, %cmDirectionWheelToWheel)"
    //% weight=100
    //% blockSetVariable=ltCar
    export function newLineTrackingCar(cmDiameterOfWheel: number, cmDirectionWheelToWheel: number): LineTrackingCar {
        return new LineTrackingCar(cmDiameterOfWheel, cmDirectionWheelToWheel)
    }


}
I2C_LCD1602.LcdInit(39)