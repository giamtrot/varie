
def books = [
'Andai, dentro la notte illuminata' ]

books.each { book ->
    def fileName = nameToFile(book) + '.xml'
    println "$book -> $fileName"
    def file = new File(fileName)
    if (file.exists()) {
        println "File $fileName already exists."
    } else {
        file.createNewFile()
        println "File $fileName created."
    }
}

def nameToFile(String name) {
    name = name.replaceAll(/['’,]/, '')
    name = name.split(/\s+/).collect { it.capitalize() }.join('')
    name
}
