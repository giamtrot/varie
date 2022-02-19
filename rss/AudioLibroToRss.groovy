@Grab(group='org.ccil.cowan.tagsoup', module='tagsoup', version='1.2')

import java.text.SimpleDateFormat

import groovy.xml.MarkupBuilder

import groovy.json.JsonSlurper

final RSS_DIR = /C:\Users\giamt\Desktop\Locale\github\varie\rss/ + "\\"

if (args.size() < 3) {
	println this.class.getSimpleName() + ".groovy <url del libro> <nome del libro> <primo giorno>"
    System.exit(-1)
}

// https://www.raiplaysound.it/audiolibri/leterredelsacramento.json
def inUrl = args[0]
def outFile = RSS_DIR + args[1] + ".xml"
def firstDay = args[2]
println "firstDay"
System.exit(0)
println "$inUrl -> $outFile"

def book = new JsonSlurper().parse(new URL(inUrl))


def bookTitle = book.title
println bookTitle

def formatter = new SimpleDateFormat('EEE, d MMM yyyy hh:mm:ss Z', Locale.ENGLISH)

def xmlWriter = new StringWriter()
def xmlMarkup = new MarkupBuilder(xmlWriter)
def today = new GregorianCalendar(2022, 0, 15)

// today.add(Calendar.DATE, -items.size() -1)
xmlMarkup.rss {
	channel {
		title(bookTitle)
		book.block.cards.each{ n->
			'item' {
				title(n.audio.title)
				link(n.audio.url)
				description(n.audio.title)
				enclosure(type: "audio/mpeg", url:n.audio.url)

				today.add(Calendar.DATE, 1)
				pubDate(formatter.format(today.time))
				guid(n.audio.url)
			}
		}
	}
}

// println  xmlWriter.toString()
new File(outFile).write( xmlWriter.toString() )
