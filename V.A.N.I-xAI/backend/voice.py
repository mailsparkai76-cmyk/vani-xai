import pyttsx3
import speech_recognition as sr

def speak(text):
    """Speak text using pyttsx3"""
    try:
        engine = pyttsx3.init()
        engine.setProperty("rate", 170)
        engine.say(text)
        engine.runAndWait()
        engine.stop()
    except Exception as e:
        print(f"Voice error: {e}")

def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio = r.listen(source)
    try:
        return r.recognize_google(audio)
    except:
        return ""
