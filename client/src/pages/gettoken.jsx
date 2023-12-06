import { useClipboard, Input, Button } from '@chakra-ui/react'

function getTokenPage() {
    const placeholder = "TokenNumber-123";
    const { onCopy, value, setValue, hasCopied } = useClipboard("");
  
    return (
      <>
        <Flex mb={2}>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            mr={2}
          />
          <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
        </Flex>
      </>
    )
  }