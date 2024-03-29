"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { useFormik } from 'formik';
import { useEffect, useState } from "react"
import * as Yup from 'yup';
import Spinner from "../ui/spinner"

export function ChangeNameDialog() {
    const auth = useAuth()
    const user = auth?.user?.data
    const [dialogOpen, setDialogOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            password: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .required('First Name is required'),
            lastName: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .required('Last Name is required'),
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            await auth?.changeName(values)
            formik.setSubmitting(false)
        }
    })

    useEffect(() => {
        dialogOpen && formik.setValues({
            firstName: user?.firstName!,
            lastName: user?.lastName!,
            password: ''
        })
    }, [dialogOpen])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Name</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Name</DialogTitle>
                    <DialogDescription>
                        {"Make changes to your name here. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                {auth?.isLoading && <div className="mx-auto"><Spinner /></div>}
                {!auth?.isLoading &&
                    (<form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="firstName" >
                                    First Name
                                </Label>
                                <Input
                                    name="firstName"
                                    defaultValue={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="col-span-3"
                                />
                                {formik.touched.firstName && formik.errors.firstName
                                    ? (<div className="col-span-4 text-red-500 text-xs">
                                        {formik.errors.firstName}
                                    </div>)
                                    : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lastName" >
                                    Last Name
                                </Label>
                                <Input
                                    name="lastName"
                                    defaultValue={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="col-span-3"
                                />
                                {formik.touched.lastName && formik.errors.lastName
                                    ? (<div className="col-span-4 text-red-500 text-xs">
                                        {formik.errors.lastName}
                                    </div>)
                                    : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" >
                                    Your Password
                                </Label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your password to save changes"
                                    className="col-span-3"
                                />
                                {formik.touched.password && formik.errors.password
                                    ? (<div className="col-span-4 text-red-500 text-xs">
                                        {formik.errors.password}
                                    </div>)
                                    : null}
                            </div>
                            <div>
                                {auth?.error?.status
                                    ? (<div className="text-red-500 text-xs">
                                        {auth.error?.message
                                            ? auth.error?.message
                                            : 'An Error occured. Something went wrong'}
                                    </div>)
                                    : null}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={formik.isSubmitting || auth?.isLoading}>Save changes</Button>
                            </DialogFooter>
                        </div>
                    </form>)
                }
            </DialogContent>
        </Dialog>
    )
}
