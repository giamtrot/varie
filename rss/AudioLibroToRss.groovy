@Grab(group='org.ccil.cowan.tagsoup', module='tagsoup', version='1.2')

import java.text.SimpleDateFormat

import groovy.xml.MarkupBuilder

final RSS_DIR = /C:\Users\giamt\Desktop\Locale\github\varie\rss/ + "\\"

if (args.size() < 2) {
	println this.class.getSimpleName() + ".groovy <url del libro> <nome del libro>"
    System.exit(-1)
}


def inUrl = args[0]
def outFile = RSS_DIR + args[1] + ".xml"

println "$inUrl -> $outFile"

def parser = new XmlSlurper(new org.ccil.cowan.tagsoup.Parser())
def doc = parser.parse(inUrl)

def items = doc.'**'.findAll {
	it['@role'] == 'playlist-item'
}

def bookTitle = doc.head.title.text()
def formatter = new SimpleDateFormat('EEE, d MMM yyyy hh:mm:ss Z', Locale.ENGLISH)

def xmlWriter = new StringWriter()
def xmlMarkup = new MarkupBuilder(xmlWriter)
def today = new GregorianCalendar()
// today.add(Calendar.DATE, -items.size() -1)
xmlMarkup.rss {
	channel {
		title(bookTitle)
		items.each { n ->
			'item' {
				title(n.h2.text().trim())
				link(n['@data-mediapolis'])
				description(n.h2.text().trim())
				enclosure(type: "audio/mpeg", url:n['@data-mediapolis'])

				today.add(Calendar.DATE, 1)
				pubDate(formatter.format(today.time))
				guid(n['@data-mediapolis'])
			}
		}
	}
}

//		println  xmlWriter.toString()
new File(outFile).write( xmlWriter.toString() )
