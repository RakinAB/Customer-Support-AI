'use client'
import { useState } from "react"
import { Box, Button, Stack, TextField } from "@mui/material"
import Image from "next/image"


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:`Hello, I am your Tech Savy Support Agent. How may I help you today?`
    }
  ])

  const [message, setMessage] = useState('')
  
 
  const sendMessage = async() => {
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {role:'user', content: message},
      {role:'assistant', content: ''}
    ])
    const response = fetch('/api/chat', {
      method: 'POST', 
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify([...messages, {role:'user', content: message}])
    }).then( async(res) =>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}){
        if(done){
          return result
        } 
        const text  = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length-1]
          let otherMessages= messages.slice(0, messages.length-1)
          return[
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }
  
  return( 
    <Box 
      width='100vw' 
      height='100vh' 
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      bgcolor={'#343434'}
    >
      <Image 
        src="/logo.png"
        width={550}
        height={100}
        alt="Headstarter AI"
      />

      <Stack
        direction={'column'}
        width={'1000px'}
        height='700px'
        p={2}
        spacing={3}
        bgcolor={'#555555'}
        borderRadius={12}
      >
        <Stack
          direction='column'
          spacing={2}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100%'}
        >
          {messages.map((message, index)=>(
            <Box 
              key={index} 
              display='flex' 
              justifyContent={
                message.role==='assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'gray'
                }
                color='white'
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField 
            label = 'Send a message'
            fullWidth
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'white',
              },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'white',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'white',
              },
            }}
          />
          <Button 
            variant="contained"
            sx={{
              borderRadius: '50%',
              width: '60px', // Adjust the size as needed
              height: '60px', // Adjust the size as needed
              minWidth: '60px', // Ensure the button doesn't resize
              padding: 0, // Remove default padding
            }}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
