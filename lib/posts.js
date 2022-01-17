import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'



const postDirectory = path.join(process.cwd(), 'posts') // 현재 작업 디렉토리 반환

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postDirectory)
    const allPostData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '')

        const fullPath = path.join(postDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // parse the post metadata section
        const matterResult = matter(fileContents)

        return {
            id,
            ...matterResult.data
        }
    })
    return allPostData.sort(({data: a}, {data: b}) => {
        if(a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory)
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })

}

export async function getPostData(id) {
    const fullPath = path.join(postDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // use gray-matter parse the post metadata section
    const matterResult = matter(fileContents)

    // use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}
