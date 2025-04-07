import React, { useContext, useState, useEffect } from "react";
import {
    AppBar, Toolbar, Typography, Card, CardContent, Grid, Paper, Button,
    Modal, Box, TextField
} from "@mui/material";
import { useGetUserById } from "../../shared/apis/User/UseGetUsersById";
import { useUpdateUserById } from "../../shared/apis/User/useUpdateUserById";
import AuthContext from "../../context/AuthContext";

const UserDetails: React.FC = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) return <Typography color="error" align="center">Error: Auth Context not available</Typography>;

    const { user: authUser } = authContext;
    const userId = authUser?.userId ?? "";
    const { data: fetchedUser, isLoading, error, refetch } = useGetUserById(userId);
    const updateUserMutation = useUpdateUserById();

    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (fetchedUser) {
            setUserData({
                ...fetchedUser,
                paymentDetails: fetchedUser.paymentDetails || {
                    cardNumber: "",
                    cvv: "",
                    expiryDate: "",
                    cardHolderName: "",
                    cardTypeEnum: "",
                }
            });
        }
    }, [fetchedUser]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserData((prev: any) => {
            if (name.startsWith("paymentDetails.")) {
                const field = name.split(".")[1];
                return {
                    ...prev,
                    paymentDetails: {
                        ...prev.paymentDetails,
                        [field]: value
                    }
                };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleSubmit = () => {
        const formattedData = {
            ...userData,
            paymentDetails: {
                cardNumber: userData.paymentDetails?.cardNumber || "",
                cvv: userData.paymentDetails?.cvv || "",
                expiryDate: userData.paymentDetails?.expiryDate || "",
                cardHolderName: userData.paymentDetails?.cardHolderName || "",
                cardTypeEnum: userData.paymentDetails?.cardTypeEnum || "",
            }
        };

        console.log("Submitting Updated User Data:", JSON.stringify(formattedData, null, 2));

        updateUserMutation.mutate(
            { userId, userData: formattedData },
            {
                onSuccess: (response) => {
                    console.log("Update Successful:", response);
                    handleClose();
                    refetch(); 
                },
                onError: (error: any) => {
                    console.error("Update Failed:", error.response?.data || error.message);
                }
            }
        );
    };

    if (isLoading) return <Typography color="primary" align="center">Loading...</Typography>;
    if (error) return <Typography color="error" align="center">Error: {error.message}</Typography>;
    if (!fetchedUser) return <Typography align="center">No user details available.</Typography>;

    return (
        <>
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        User Details
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Update Details
                    </Button>
                </Toolbar>
            </AppBar>

            {/* User Details */}
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>User Information</Typography>
                            {[
                                "name", "email", "phoneNumber", "dateOfBirth", "gender",
                                "address", "city", "state", "country", "zipCode",
                                "currentActiveClubId", "preferredTime",
                            ].map((field) => (
                                <Typography key={field}>
                                    <strong>{field.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                                    {field === "dateOfBirth" && fetchedUser?.[field]
                                        ? new Date(fetchedUser[field]).toISOString().split("T")[0]
                                        : fetchedUser?.[field] || "N/A"}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'background.paper',
                        boxShadow: 24, p: 4, borderRadius: 2,
                        maxHeight: "80vh", overflowY: "auto"
                    }}
                >
                    <Typography variant="h6" gutterBottom>Update User Details</Typography>

                    {/* Editable Fields */}
                    {[
                        "name", "email", "phoneNumber", "dateOfBirth", "gender",
                        "address", "city", "state", "country", "zipCode",
                        "preferredTime",
                    ].map((field) => (
                        <TextField
                            key={field}
                            fullWidth
                            label={field.replace(/([A-Z])/g, " $1")}
                            name={field}
                            type={field === "dateOfBirth" ? "date" : "text"}
                            value={
                                field === "dateOfBirth" && userData[field]
                                    ? new Date(userData[field]).toISOString().split("T")[0]
                                    : userData[field] || ""
                            }
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            InputLabelProps={field === "dateOfBirth" ? { shrink: true } : {}}
                        />
                    ))}

                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default UserDetails;
