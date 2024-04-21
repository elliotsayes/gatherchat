import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CharacterCreator } from "./CharacterCreator"
import { randomSeed } from "@/sprite/edit"
import { useState } from "react"
 
const formSchema = z.object({
  username: z.string().min(2).max(10),
})

const formWithSeed = z.intersection(formSchema, z.object({
  avatarSeed: z.string().length(16).regex(/^[0-9a-f]+$/i),
}))

interface SetupFormProps {
  onSubmit: (values: z.infer<typeof formWithSeed>) => void
}

export const SetupForm = ({onSubmit: onSubmitProp}: SetupFormProps) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    onSubmitProp({
      ...values,
      avatarSeed: avatarSeed,
    })
  }

  const [avatarSeed, setAvatarSeed] = useState(randomSeed());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>2-10 Characters</FormDescription>
                <FormMessage />
              </FormItem>
          )}
        />
        <CharacterCreator initialSeed={avatarSeed} onSeedChange={setAvatarSeed} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
