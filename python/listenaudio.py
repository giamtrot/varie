# Import packages
from pydub import AudioSegment
from pydub.playback import play  
# Play
playaudio = AudioSegment.from_file("ha.mp3", format="mp3")
play(playaudio)