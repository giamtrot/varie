@Grab('org.jsoup:jsoup:1.17.2')
// @Grab('org.ccil.cowan.tagsoup:tagsoup:1.2')

import org.jsoup.Jsoup
import groovy.json.JsonSlurper
import java.text.SimpleDateFormat
import groovy.xml.MarkupBuilder
import groovy.json.JsonSlurper

final RSS_DIR = "./"
final DATE_FILE = RSS_DIR + "AdAltaVoce.date"
final TO_EXCLUDE = ["Alice nel paese delle meraviglie", "Alpinisti ciabattoni", "Amuleto", "Cuore di tenebra", "Diario di Anna Frank", "Febbre", 
"Fiabe dei fratelli Grimm", "Flush. Una biografia", "Gioventù senza Dio", "I Malavoglia", "I dolori del giovane Werther", "I mille da Genova a Capua", "I promessi sposi", 
"I ragazzi della Via Pal", "I viaggi di Gulliver", "Il Milione", "Il cappello del prete", "Il fu Mattia Pascal", "Il giardino dei Finzi Contini", 
"Il giornalino di Gian Burrasca", "Il grande Gatsby", "Il libro della giungla", "Il mago di Oz", "Il ritratto di Dorian Gray", "Il sistema periodico", 
"La coscienza di Zeno", "La metamorfosi", "Le avventure di Pinocchio", "Le avventure di Tom Sawyer", "Lo stadio di Wimbledon", 
"Ma gli androidi sognano pecore elettriche?", "Peter Pan", "Sorelle Materassi", "Sostiene Pereira", "Ventimila leghe sotto i mari", ]

def baseUrl = new URI("https://www.raiplaysound.it/programmi/adaltavoce/audiolibri")
def document
try {
	document = Jsoup.connect(baseUrl.toString()).timeout(10000).get()
}
catch (SocketTimeoutException e) {
	println "Timeout connecting to $baseUrl"
	return
}

def lastDate = new GregorianCalendar()
lastDate.setTime(Date.parse("dd/MM/yyyy", "15/02/2025"))

def dateFile = new File(DATE_FILE)
if (dateFile.exists()) {
	dateFile.withReader { reader ->
		def line = reader.readLine()
		if (line) {
			lastDate.setTime(Date.parse("dd/MM/yyyy", line.split(": ")[1]))
		}
	}
}

println "Last Date: ${lastDate.time.format('dd/MM/yyyy')}"

def articles = document.select("article > a").eachAttr("href")

def done = false
articles.forEach{ href -> {
	if (!done) {
		def article = baseUrl.resolve(href).toString() + ".json"
		// println article
		def book = new JsonSlurper().parse(new URL(article))
		def bookTitle = book.title.trim()
		def fileName = nameToFile(bookTitle) + '.xml'

		def file = new File(fileName)
		if (!file.exists() && !TO_EXCLUDE.contains(bookTitle)) {
			makeRSS(fileName, book, lastDate)
			println "$bookTitle -> $fileName (${lastDate.time.format('dd/MM/yyyy')})"
			open(fileName)
			done = true
			// println "$bookTitle"
		}
	}
}}


dateFile.withWriter { writer ->
	writer.writeLine("Last Date: ${lastDate.time.format('dd/MM/yyyy')}")
}

//===============================


def open(filename) {
	def shellCommand = "explorer https://raw.githubusercontent.com/giamtrot/varie/refs/heads/master/rss/${filename}.xml"
	def process = shellCommand.execute()
	def output = new StringBuffer()
	process.consumeProcessOutput(output, System.err)
	process.waitFor()
	println output.toString()
}

def nameToFile(String name) {
    name = name.replaceAll(/['’,]/, '')
    name = name.split(/\s+/).collect { it.capitalize() }.join('')
    name
}

def makeRSS(fileName, book, lastDate) {
	def formatter = new SimpleDateFormat('EEE, d MMM yyyy hh:mm:ss Z', Locale.ENGLISH)

	def xmlWriter = new StringWriter()
	def xmlMarkup = new MarkupBuilder(xmlWriter)

	xmlMarkup.rss {
		channel {
			title(book.title)
			book.block.cards.each{ n->
				'item' {
					def urlAudio = n.downloadable_audio ?: n.audio
					// println urlAudio
					title(n.audio.title)
					link(urlAudio.url)
					description(n.audio.title)
					enclosure(type: "audio/mpeg", url:urlAudio.url)
					pubDate(formatter.format(lastDate.time))
					guid(urlAudio.url)
					lastDate.add(Calendar.DATE, 1)
				}
			}
		}
	}

	// println  xmlWriter.toString()
	new File(fileName).write( xmlWriter.toString() )
}

